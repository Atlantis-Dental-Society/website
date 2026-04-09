"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { insightSchema, type InsightInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { PhotoUploader } from "@/components/admin/photo-uploader";
import { usePhotoStaging } from "@/lib/hooks/use-photo-staging";

export type Insight = InsightInput & { id: string; createdAt: string; updatedAt: string };

interface InsightFormProps {
  initial: Insight | null;
  onDone: () => void;
}

export function InsightForm({ initial, onDone }: InsightFormProps) {
  const [insightId] = useState(() => initial?.id ?? crypto.randomUUID());

  const photoStaging = usePhotoStaging({
    entityType: "insights",
    entityId: insightId,
    initialId: initial?.id,
  });

  // Clean up staged S3 orphans on unmount (dialog closed without save, or
  // after successful save where staged photos already became saved photos).
  const cleanupRef = useRef<() => void>(() => {});
  useEffect(() => {
    cleanupRef.current = photoStaging.cleanupStaged;
  }, [photoStaging.cleanupStaged]);
  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);

  const form = useForm({
    defaultValues: {
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      excerpt: initial?.excerpt ?? "",
      body: initial?.body ?? "",
      author: initial?.author ?? "",
      authorPosition: initial?.authorPosition ?? "",
      category: initial?.category ?? "",
      coverImageUrl: initial?.coverImageUrl ?? "",
      published: initial?.published ?? true,
      publishedDate: initial?.publishedDate ?? new Date().toISOString().split("T")[0],
    } as InsightInput,
    validators: {
      onSubmit: insightSchema,
    },
    onSubmit: async ({ value }) => {
      const url = initial ? `/api/insights/${initial.id}` : "/api/insights";
      const method = initial ? "PUT" : "POST";
      const payload = initial ? value : { ...value, id: insightId };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || "Failed to save");
        return;
      }

      // Entity saved — now commit photo changes. Leave dialog open on
      // partial failure so user can retry.
      const result = await photoStaging.commit(insightId);
      if (!result.ok) {
        for (const err of result.errors) toast.error(err);
        return;
      }

      onDone();
    },
  });

  const submitWith = (published: boolean) => {
    form.setFieldValue("published", published);
    if (!form.state.values.slug) {
      form.setFieldValue("slug", slugify(form.state.values.title));
    }
    form.handleSubmit();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); submitWith(form.state.values.published ?? true); }}>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit Insight" : "Add Insight"}</DialogTitle>
        <DialogDescription>
          {initial ? "Update the insight details below." : "Fill in the details to create a new insight post."}
        </DialogDescription>
      </DialogHeader>

      <FieldGroup className="mt-4">
        <FieldGroup className="flex-row">
          <form.Field name="title">
            {(f) => {
              const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="ins-title">Title *</FieldLabel>
                  <Input id="ins-title" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} aria-invalid={isInvalid || undefined} />
                  {isInvalid && <FieldError errors={f.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="slug">
            {(f) => {
              const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="ins-slug">Slug (auto if empty)</FieldLabel>
                  <Input id="ins-slug" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} aria-invalid={isInvalid || undefined} />
                  {isInvalid && <FieldError errors={f.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <form.Field name="excerpt">
          {(f) => (
            <Field>
              <FieldLabel htmlFor="ins-excerpt">Excerpt</FieldLabel>
              <Textarea id="ins-excerpt" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} rows={2} />
            </Field>
          )}
        </form.Field>

        <form.Field name="body">
          {(f) => (
            <Field>
              <FieldLabel htmlFor="ins-body">Body (Markdown)</FieldLabel>
              <Textarea id="ins-body" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} rows={10} className="font-mono text-xs" />
            </Field>
          )}
        </form.Field>

        <FieldGroup className="flex-row">
          <form.Field name="author">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="ins-author">Author</FieldLabel>
                <Input id="ins-author" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} />
              </Field>
            )}
          </form.Field>
          <form.Field name="authorPosition">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="ins-author-pos">Author Position</FieldLabel>
                <Input id="ins-author-pos" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} />
              </Field>
            )}
          </form.Field>
          <form.Field name="category">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="ins-category">Category</FieldLabel>
                <Input id="ins-category" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="e.g. Student Life" />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <FieldGroup className="flex-row">
          <form.Field name="publishedDate">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="ins-date">Published Date</FieldLabel>
                <Input type="date" id="ins-date" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} />
              </Field>
            )}
          </form.Field>
          <form.Field name="coverImageUrl">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="ins-cover">Cover Image URL</FieldLabel>
                <Input id="ins-cover" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <PhotoUploader
          photos={photoStaging.photos}
          uploading={photoStaging.uploading}
          onPickFiles={photoStaging.uploadFiles}
          onRemove={photoStaging.remove}
          onReorder={photoStaging.reorder}
        />
      </FieldGroup>

      <DialogFooter className="mt-4 gap-2">
        <Button type="button" variant="outline" className="rounded-full" onClick={() => submitWith(false)}>
          Save as Draft
        </Button>
        <Button type="button" className="rounded-full" onClick={() => submitWith(true)}>
          Publish
        </Button>
      </DialogFooter>
    </form>
  );
}
