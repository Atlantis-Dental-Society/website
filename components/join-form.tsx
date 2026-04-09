"use client";

import { useForm } from "@tanstack/react-form";
import { joinSubmissionSchema, type JoinSubmissionInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, CheckCircle } from "lucide-react";
import { useState } from "react";

export function JoinForm({
  formHeading,
  formDescription,
  successHeading,
  successMessage,
}: {
  formHeading?: string | null;
  formDescription?: string | null;
  successHeading?: string | null;
  successMessage?: string | null;
}) {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      major: "",
      year: "",
      school: "",
      interestInDentistry: "",
      whyDentistry: "",
    } as JoinSubmissionInput,
    validators: {
      onSubmit: joinSubmissionSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch("/api/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong");
        }

        setStatus("success");
        toast.success("Application submitted successfully!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    },
  });

  if (status === "success") {
    return (
      <Card className="rounded-3xl border-none ring-0 shadow-warm">
        <CardContent className="p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage/15 mx-auto">
            <CheckCircle className="h-8 w-8 text-sage" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">{successHeading || "Application Submitted!"}</h2>
          <p className="mt-3 text-muted-foreground">
            {successMessage || "Thank you for your interest in Atlantis Dental Society. We\u2019ll be in touch soon."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-none ring-0 shadow-warm">
      <CardContent className="p-8 sm:p-10">
        <h2 className="text-2xl font-extrabold">{formHeading || "Application Form"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{formDescription || "Fill out the form below and we\u2019ll get back to you."}</p>

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <form.Field name="name">
              {(f) => {
                const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid || undefined}>
                    <FieldLabel htmlFor="join-name">Name *</FieldLabel>
                    <Input
                      id="join-name"
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value)}
                      placeholder="Your full name"
                      aria-invalid={isInvalid || undefined}
                    />
                    {isInvalid && <FieldError errors={f.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="email">
              {(f) => {
                const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid || undefined}>
                    <FieldLabel htmlFor="join-email">Email *</FieldLabel>
                    <Input
                      id="join-email"
                      type="email"
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={isInvalid || undefined}
                    />
                    {isInvalid && <FieldError errors={f.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <form.Field name="major">
              {(f) => (
                <Field>
                  <FieldLabel htmlFor="join-major">Major</FieldLabel>
                  <Input
                    id="join-major"
                    value={f.state.value}
                    onBlur={f.handleBlur}
                    onChange={(e) => f.handleChange(e.target.value)}
                    placeholder="e.g. Biology"
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="year">
              {(f) => (
                <Field>
                  <FieldLabel>Year of Study</FieldLabel>
                  <Select value={f.state.value} onValueChange={(v) => f.handleChange(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
          </div>

          <form.Field name="school">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="join-school">School</FieldLabel>
                <Input
                  id="join-school"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(e.target.value)}
                  placeholder="e.g. York University"
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="interestInDentistry">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="join-interest">What interests you about dentistry?</FieldLabel>
                <Textarea
                  id="join-interest"
                  rows={3}
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(e.target.value)}
                  placeholder="Tell us about your interest in dentistry..."
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="whyDentistry">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="join-why">Why do you want to become a dentist?</FieldLabel>
                <Textarea
                  id="join-why"
                  rows={3}
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e) => f.handleChange(e.target.value)}
                  placeholder="Share your motivation..."
                />
              </Field>
            )}
          </form.Field>

          <Button type="submit" className="w-full rounded-full py-6 text-base gap-2 shadow-gold" size="lg">
            <Send className="h-4 w-4" />
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
