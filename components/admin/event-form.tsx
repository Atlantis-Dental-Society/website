"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { eventSchema, type EventInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PhotoUploader } from "@/components/admin/photo-uploader";
import { usePhotoStaging } from "@/lib/hooks/use-photo-staging";

export type Event = EventInput & { id: string; createdAt: string; updatedAt: string };

interface EventFormProps {
  initial: Event | null;
  onDone: () => void;
}

export function EventForm({ initial, onDone }: EventFormProps) {
  const [eventId] = useState(() => initial?.id ?? crypto.randomUUID());

  const photoStaging = usePhotoStaging({
    entityType: "events",
    entityId: eventId,
    initialId: initial?.id,
  });

  // On form unmount (dialog close without save, or after successful save)
  // clean up any staged S3 objects that never got committed. After a
  // successful commit, staged photos are transformed to saved — so this is
  // a no-op in that case. The ref pattern keeps the latest cleanup fn
  // available to the unmount effect without stale-closure bugs.
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
      description: initial?.description ?? "",
      date: initial?.date ?? "",
      endDate: initial?.endDate ?? "",
      time: initial?.time ?? "",
      location: initial?.location ?? "",
      category: initial?.category ?? "",
      registrationUrl: initial?.registrationUrl ?? "",
      featured: initial?.featured ?? false,
      published: initial?.published ?? true,
    } as EventInput,
    validators: {
      onSubmit: eventSchema,
    },
    onSubmit: async ({ value }) => {
      const url = initial ? `/api/events/${initial.id}` : "/api/events";
      const method = initial ? "PUT" : "POST";
      const payload = initial ? value : { ...value, id: eventId };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
        return;
      }

      // Entity saved successfully — now commit photo changes. If photo commit
      // partially fails we leave the dialog open so the user can retry.
      const result = await photoStaging.commit(eventId);
      if (!result.ok) {
        for (const err of result.errors) toast.error(err);
        return;
      }

      onDone();
    },
  });

  const submitWith = (published: boolean) => {
    form.setFieldValue("published", published);
    form.handleSubmit();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); submitWith(form.state.values.published ?? true); }}>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogDescription>
          {initial ? "Update the event details below." : "Fill in the details to create a new event."}
        </DialogDescription>
      </DialogHeader>

      <FieldGroup className="mt-4">
        <FieldGroup className="flex-row">
          <form.Field name="title">
            {(f) => {
              const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="evt-title">Title *</FieldLabel>
                  <Input id="evt-title" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} aria-invalid={isInvalid || undefined} />
                  {isInvalid && <FieldError errors={f.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="category">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="evt-category">Category</FieldLabel>
                <Input id="evt-category" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="e.g. Workshop" />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <form.Field name="description">
          {(f) => (
            <Field>
              <FieldLabel htmlFor="evt-desc">Description</FieldLabel>
              <Textarea id="evt-desc" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} rows={3} />
            </Field>
          )}
        </form.Field>

        <FieldGroup className="flex-row">
          <form.Field name="date">
            {(f) => {
              const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="evt-date">Date *</FieldLabel>
                  <Input type="date" id="evt-date" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} aria-invalid={isInvalid || undefined} />
                  {isInvalid && <FieldError errors={f.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="endDate">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="evt-end-date">End Date</FieldLabel>
                <Input type="date" id="evt-end-date" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} />
              </Field>
            )}
          </form.Field>
          <form.Field name="time">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="evt-time">Time</FieldLabel>
                <Input type="time" id="evt-time" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <FieldGroup className="flex-row">
          <form.Field name="location">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="evt-location">Location</FieldLabel>
                <Input id="evt-location" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} />
              </Field>
            )}
          </form.Field>
          <form.Field name="registrationUrl">
            {(f) => {
              const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="evt-reg-url">Registration URL</FieldLabel>
                  <Input id="evt-reg-url" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} aria-invalid={isInvalid || undefined} />
                  {isInvalid && <FieldError errors={f.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <form.Field name="featured">
          {(f) => (
            <Field orientation="horizontal">
              <Checkbox id="evt-featured" checked={f.state.value} onCheckedChange={(v) => f.handleChange(v === true)} />
              <FieldLabel htmlFor="evt-featured">Featured</FieldLabel>
            </Field>
          )}
        </form.Field>

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
