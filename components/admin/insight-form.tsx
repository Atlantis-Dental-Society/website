"use client";

import { useState, useEffect, useCallback } from "react";
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
import { PhotoUploader, type Photo } from "@/components/admin/photo-uploader";

export type Insight = InsightInput & { id: string; createdAt: string; updatedAt: string };

interface InsightFormProps {
  initial: Insight | null;
  onDone: () => void;
}

export function InsightForm({ initial, onDone }: InsightFormProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [insightId] = useState(() => initial?.id ?? crypto.randomUUID());

  const loadPhotos = useCallback(async (id: string) => {
    const res = await fetch(`/api/photos?entityType=insights&entityId=${id}`);
    if (res.ok) setPhotos(await res.json());
  }, []);

  useEffect(() => {
    if (initial?.id) loadPhotos(initial.id);
  }, [initial?.id, loadPhotos]);

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
      onChange: insightSchema,
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
          entityType="insights"
          entityId={insightId}
          photos={photos}
          onPhotosChange={setPhotos}
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
