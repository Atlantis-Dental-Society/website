"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { insightSchema, type InsightInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { slugify } from "@/lib/utils";

export type Insight = InsightInput & { id: number; createdAt: string; updatedAt: string };

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
    },
    onSubmit: async ({ value }) => {
      const data = { ...value, slug: value.slug || slugify(value.title) };
      const result = insightSchema.safeParse(data);
      if (!result.success) {
        setError(result.error.issues[0]?.message || "Validation failed");
        return;
      }

      const url = initial ? `/api/insights/${initial.id}` : "/api/insights";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
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
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
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
          <Field>
            <FieldLabel htmlFor="ins-title">Title *</FieldLabel>
            <form.Field name="title">
              {(f) => <Input id="ins-title" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="ins-slug">Slug (auto if empty)</FieldLabel>
            <form.Field name="slug">
              {(f) => <Input id="ins-slug" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
        </FieldGroup>

        <Field>
          <FieldLabel htmlFor="ins-excerpt">Excerpt</FieldLabel>
          <form.Field name="excerpt">
            {(f) => <Textarea id="ins-excerpt" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} rows={2} />}
          </form.Field>
        </Field>

        <Field>
          <FieldLabel htmlFor="ins-body">Body (Markdown)</FieldLabel>
          <form.Field name="body">
            {(f) => <Textarea id="ins-body" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} rows={10} className="font-mono text-xs" />}
          </form.Field>
        </Field>

        <FieldGroup className="flex-row">
          <Field>
            <FieldLabel htmlFor="ins-author">Author</FieldLabel>
            <form.Field name="author">
              {(f) => <Input id="ins-author" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="ins-author-pos">Author Position</FieldLabel>
            <form.Field name="authorPosition">
              {(f) => <Input id="ins-author-pos" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="ins-category">Category</FieldLabel>
            <form.Field name="category">
              {(f) => <Input id="ins-category" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} placeholder="e.g. Student Life" />}
            </form.Field>
          </Field>
        </FieldGroup>

        <FieldGroup className="flex-row">
          <Field>
            <FieldLabel htmlFor="ins-date">Published Date</FieldLabel>
            <form.Field name="publishedDate">
              {(f) => <Input type="date" id="ins-date" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="ins-cover">Cover Image URL</FieldLabel>
            <form.Field name="coverImageUrl">
              {(f) => <Input id="ins-cover" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
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
