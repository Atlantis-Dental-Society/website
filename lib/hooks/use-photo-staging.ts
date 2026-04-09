"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export interface SavedPhoto {
  kind: "saved";
  id: string;
  url: string;
  key: string;
}

export interface StagedPhoto {
  kind: "staged";
  tempId: string;
  url: string;
  key: string;
}

export type StagedDisplayPhoto = SavedPhoto | StagedPhoto;

export function photoKey(p: StagedDisplayPhoto): string {
  return p.kind === "saved" ? p.id : p.tempId;
}

interface UsePhotoStagingOptions {
  entityType: "events" | "insights";
  entityId: string;
  initialId?: string;
}

interface CommitResult {
  ok: boolean;
  errors: string[];
}

// Fire-and-forget S3 cleanup for a staged (never-persisted) key.
function cleanupKey(key: string) {
  fetch("/api/upload/cleanup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  }).catch(() => {});
}

// Pull an error message off a JSON response, falling back to a readable
// default with the status code when the server returned a non-JSON body.
async function extractError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data?.error) return data.error;
  } catch {
    /* not json */
  }
  return `${fallback} (${res.status})`;
}

export function usePhotoStaging({ entityType, entityId, initialId }: UsePhotoStagingOptions) {
  // Single source of truth for display order. Contains both saved and staged
  // photos; deletions just filter them out here and track the removed saved
  // photos in `deletedSaved` so they can be DELETEd on commit.
  const [photos, setPhotos] = useState<StagedDisplayPhoto[]>([]);
  const [deletedSaved, setDeletedSaved] = useState<SavedPhoto[]>([]);
  // Initial server order for remaining (non-deleted) saved photos, used to
  // detect whether the user reordered anything.
  const [initialSavedOrder, setInitialSavedOrder] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const loadedRef = useRef(false);
  // Guards against cleanupStaged racing with an in-flight commit — if the
  // user closes the dialog mid-save, we don't want to DELETE S3 objects that
  // the commit is about to persist as photo rows.
  const committingRef = useRef(false);

  // Load saved photos once when editing an existing entity. Don't re-seed
  // mid-lifecycle — staged changes would otherwise be wiped on re-render.
  useEffect(() => {
    if (!initialId || loadedRef.current) return;
    loadedRef.current = true;

    (async () => {
      try {
        const res = await fetch(`/api/photos?entityType=${entityType}&entityId=${initialId}`);
        if (!res.ok) return;
        const data: Array<{ id: string; url: string; key: string }> = await res.json();
        const saved: SavedPhoto[] = data.map((p) => ({
          kind: "saved",
          id: p.id,
          url: p.url,
          key: p.key,
        }));
        setPhotos(saved);
        setInitialSavedOrder(saved.map((p) => p.id));
      } catch {
        // leave empty
      }
    })();
  }, [entityType, initialId]);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      setUploading(true);
      const newStaged: StagedPhoto[] = [];
      let failures = 0;

      for (const file of imageFiles) {
        try {
          if (!file.type) {
            throw new Error(`${file.name}: unknown file type`);
          }

          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              entityType,
              entityId,
            }),
          });
          if (!res.ok) {
            throw new Error(await extractError(res, "Failed to get upload URL"));
          }
          const { presignedUrl, publicUrl, key } = await res.json();

          const putRes = await fetch(presignedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });
          if (!putRes.ok) {
            throw new Error(`S3 upload failed (${putRes.status})`);
          }

          newStaged.push({
            kind: "staged",
            tempId: `staged:${crypto.randomUUID()}`,
            url: publicUrl,
            key,
          });
        } catch (err) {
          failures += 1;
          toast.error(err instanceof Error ? err.message : "Upload failed");
        }
      }

      if (newStaged.length > 0) {
        setPhotos((prev) => [...prev, ...newStaged]);
        if (failures === 0) {
          toast.success(
            newStaged.length === 1 ? "Image uploaded" : `${newStaged.length} images uploaded`,
          );
        }
      }
      setUploading(false);
    },
    [entityType, entityId],
  );

  const remove = useCallback((photo: StagedDisplayPhoto) => {
    if (photo.kind === "saved") {
      setDeletedSaved((prev) => [...prev, photo]);
      setPhotos((prev) => prev.filter((p) => photoKey(p) !== photo.id));
    } else {
      // Staged photo was never persisted to the DB — clean up the S3 orphan
      // immediately and drop from local state.
      cleanupKey(photo.key);
      setPhotos((prev) => prev.filter((p) => photoKey(p) !== photo.tempId));
    }
  }, []);

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setPhotos((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex < 0 ||
        toIndex >= prev.length ||
        fromIndex === toIndex
      ) {
        return prev;
      }
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const commit = useCallback(
    async (committedEntityId: string): Promise<CommitResult> => {
      committingRef.current = true;
      try {
        const errors: string[] = [];

        // Snapshot current arrays so we don't race with state updates during commit.
        const currentPhotos = photos;
        const stagedList = currentPhotos.filter((p): p is StagedPhoto => p.kind === "staged");
        const savedInOrder = currentPhotos.filter((p): p is SavedPhoto => p.kind === "saved");
        const deleteList = deletedSaved;

        // 1. POST each staged photo with its final order index (position in
        //    currentPhotos), so the DB row is created with the correct order.
        const stagedResults = await Promise.allSettled(
          stagedList.map(async (s) => {
            const orderIdx = currentPhotos.indexOf(s);
            const res = await fetch("/api/photos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                entityType,
                entityId: committedEntityId,
                url: s.url,
                key: s.key,
                order: String(orderIdx),
              }),
            });
            if (!res.ok) throw new Error(`Failed to save photo ${s.key}`);
            const created: { id: string; url: string; key: string } = await res.json();
            return { staged: s, created };
          }),
        );

        // 2. DELETE each removed saved photo.
        const deleteResults = await Promise.allSettled(
          deleteList.map(async (p) => {
            const res = await fetch(`/api/photos/${p.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`Failed to delete photo ${p.id}`);
            return p;
          }),
        );

        // 3. If saved photo order changed, PATCH the server via reorder endpoint.
        const currentSavedIds = savedInOrder.map((p) => p.id);
        const initialRemaining = initialSavedOrder.filter((id) =>
          savedInOrder.some((p) => p.id === id),
        );
        const orderChanged =
          currentSavedIds.length > 0 &&
          currentSavedIds.join(",") !== initialRemaining.join(",");

        let reorderOk = true;
        if (orderChanged) {
          const res = await fetch("/api/photos/reorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              entityType,
              entityId: committedEntityId,
              order: currentSavedIds,
            }),
          });
          reorderOk = res.ok;
        }

        // Collect outcomes
        const stagedFailed: StagedPhoto[] = [];
        const stagedSucceeded: Array<{
          staged: StagedPhoto;
          created: { id: string; url: string; key: string };
        }> = [];
        stagedResults.forEach((r, i) => {
          if (r.status === "fulfilled") {
            stagedSucceeded.push(r.value);
          } else {
            stagedFailed.push(stagedList[i]);
          }
        });

        const deleteFailed: SavedPhoto[] = [];
        deleteResults.forEach((r, i) => {
          if (r.status === "rejected") deleteFailed.push(deleteList[i]);
        });

        if (stagedFailed.length > 0) errors.push(`Failed to save ${stagedFailed.length} photo(s)`);
        if (deleteFailed.length > 0) errors.push(`Failed to delete ${deleteFailed.length} photo(s)`);
        if (!reorderOk) errors.push("Failed to update photo order");

        // Update local state to reflect what happened. Successful staged photos
        // become saved photos (with real ids from the POST response) so retrying
        // commit doesn't duplicate them. Successful deletions drop out of
        // deletedSaved. Failures stay put so the user can retry.
        if (stagedSucceeded.length > 0) {
          const byTempId = new Map(stagedSucceeded.map((s) => [s.staged.tempId, s.created]));
          setPhotos((prev) =>
            prev.map((p) => {
              if (p.kind !== "staged") return p;
              const created = byTempId.get(p.tempId);
              if (!created) return p;
              return { kind: "saved", id: created.id, url: created.url, key: created.key };
            }),
          );
        }
        if (deleteFailed.length < deleteList.length) {
          setDeletedSaved(deleteFailed);
        }
        if (reorderOk && orderChanged) {
          // Update the baseline so a retry doesn't re-send the same reorder.
          setInitialSavedOrder(currentSavedIds);
        }

        return { ok: errors.length === 0, errors };
      } finally {
        committingRef.current = false;
      }
    },
    [photos, deletedSaved, initialSavedOrder, entityType],
  );

  // Called when the parent dialog closes without saving. Deletes all staged
  // S3 objects so they don't accumulate as orphans. Skipped if a commit is
  // currently in flight — commit will handle the keys, either by persisting
  // them (success) or leaving them staged (failure).
  const cleanupStaged = useCallback(() => {
    if (committingRef.current) return;
    for (const p of photos) {
      if (p.kind === "staged") cleanupKey(p.key);
    }
  }, [photos]);

  return {
    photos,
    uploading,
    uploadFiles,
    remove,
    reorder,
    commit,
    cleanupStaged,
  };
}
