"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { eventSchema, type EventInput } from "@/lib/validations";
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
import { PhotoUploader, type Photo } from "@/components/admin/photo-uploader";

export type Event = EventInput & { id: string; createdAt: string; updatedAt: string };

interface EventFormProps {
  initial: Event | null;
  onDone: () => void;
}

export function EventForm({ initial, onDone }: EventFormProps) {
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [eventId, setEventId] = useState<string | null>(initial?.id ?? null);

  const loadPhotos = useCallback(async (id: string) => {
    const res = await fetch(`/api/photos?entityType=events&entityId=${id}`);
    if (res.ok) setPhotos(await res.json());
  }, []);

  useEffect(() => {
    if (initial?.id) loadPhotos(initial.id);
  }, [initial?.id, loadPhotos]);

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
      onChange: eventSchema,
    },
    onSubmit: async ({ value }) => {
      setError("");
      const url = initial ? `/api/events/${initial.id}` : "/api/events";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      // If creating new event, get the ID for photo uploads
      if (!initial) {
        const created = await res.json();
        setEventId(created.id);
      }

      onDone();
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogDescription>
          {initial ? "Update the event details below." : "Fill in the details to create a new event."}
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

        <div className="flex gap-6">
          <form.Field name="featured">
            {(f) => (
              <Field orientation="horizontal">
                <Checkbox id="evt-featured" checked={f.state.value} onCheckedChange={(v) => f.handleChange(v === true)} />
                <FieldLabel htmlFor="evt-featured">Featured</FieldLabel>
              </Field>
            )}
          </form.Field>
          <form.Field name="published">
            {(f) => (
              <Field orientation="horizontal">
                <Checkbox id="evt-published" checked={f.state.value} onCheckedChange={(v) => f.handleChange(v === true)} />
                <FieldLabel htmlFor="evt-published">Published</FieldLabel>
              </Field>
            )}
          </form.Field>
        </div>

        {/* Photo uploader - only shown when editing (event already has an ID) */}
        {eventId && (
          <PhotoUploader
            entityType="events"
            entityId={eventId}
            photos={photos}
            onPhotosChange={setPhotos}
          />
        )}
        {!eventId && (
          <p className="text-xs text-muted-foreground">Save the event first, then you can add photos.</p>
        )}
      </FieldGroup>

      <DialogFooter className="mt-4">
        <Button type="submit" className="rounded-full">{initial ? "Update" : "Create"} Event</Button>
      </DialogFooter>
    </form>
  );
}
