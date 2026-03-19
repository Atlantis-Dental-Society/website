"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { eventSchema, type EventInput } from "@/lib/validations";
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

export type Event = EventInput & { id: number; createdAt: string; updatedAt: string };

interface EventFormProps {
  initial: Event | null;
  onDone: () => void;
}

export function EventForm({ initial, onDone }: EventFormProps) {
  const [error, setError] = useState("");

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
    },
    onSubmit: async ({ value }) => {
      const result = eventSchema.safeParse(value);
      if (!result.success) {
        setError(result.error.issues[0]?.message || "Validation failed");
        return;
      }

      const url = initial ? `/api/events/${initial.id}` : "/api/events";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
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
          <Field>
            <FieldLabel htmlFor="evt-title">Title *</FieldLabel>
            <form.Field name="title">
              {(f) => <Input id="evt-title" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="evt-category">Category</FieldLabel>
            <form.Field name="category">
              {(f) => <Input id="evt-category" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} placeholder="e.g. Workshop" />}
            </form.Field>
          </Field>
        </FieldGroup>

        <Field>
          <FieldLabel htmlFor="evt-desc">Description</FieldLabel>
          <form.Field name="description">
            {(f) => <Textarea id="evt-desc" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} rows={3} />}
          </form.Field>
        </Field>

        <FieldGroup className="flex-row">
          <Field>
            <FieldLabel htmlFor="evt-date">Date *</FieldLabel>
            <form.Field name="date">
              {(f) => <Input type="date" id="evt-date" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="evt-end-date">End Date</FieldLabel>
            <form.Field name="endDate">
              {(f) => <Input type="date" id="evt-end-date" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="evt-time">Time</FieldLabel>
            <form.Field name="time">
              {(f) => <Input type="time" id="evt-time" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
        </FieldGroup>

        <FieldGroup className="flex-row">
          <Field>
            <FieldLabel htmlFor="evt-location">Location</FieldLabel>
            <form.Field name="location">
              {(f) => <Input id="evt-location" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="evt-reg-url">Registration URL</FieldLabel>
            <form.Field name="registrationUrl">
              {(f) => <Input id="evt-reg-url" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />}
            </form.Field>
          </Field>
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
      </FieldGroup>

      <DialogFooter className="mt-4">
        <Button type="submit" className="rounded-full">{initial ? "Update" : "Create"} Event</Button>
      </DialogFooter>
    </form>
  );
}
