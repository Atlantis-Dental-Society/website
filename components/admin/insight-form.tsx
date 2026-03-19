"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { insightSchema, type InsightInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { slugify } from "@/lib/utils";

export type Insight = InsightInput & { id: string; createdAt: string; updatedAt: string };

interface InsightFormProps {
  initial: Insight | null;
  onDone: () => void;
}

export function InsightForm({ initial, onDone }: InsightFormProps) {
  const [error, setError] = useState("");

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
      setError("");
      const url = initial ? `/api/insights/${initial.id}` : "/api/insights";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to save");
        return;
      }
      onDone();
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!form.state.values.slug) {
        form.setFieldValue("slug", slugify(form.state.values.title));
      }
      form.handleSubmit();
    }}>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit Insight" : "Add Insight"}</DialogTitle>
        <DialogDescription>
          {initial ? "Update the insight details below." : "Fill in the details to create a new insight post."}
        </DialogDescription>
      </DialogHeader>

      {error && (
        <Alert variant="destructive" className="mt-2 border-none">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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

        <form.Field name="published">
          {(f) => (
            <Field orientation="horizontal">
              <Checkbox id="ins-published" checked={f.state.value} onCheckedChange={(v) => f.handleChange(v === true)} />
              <FieldLabel htmlFor="ins-published">Published</FieldLabel>
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <DialogFooter className="mt-4">
        <Button type="submit" className="rounded-full">{initial ? "Update" : "Create"} Insight</Button>
      </DialogFooter>
    </form>
  );
}
