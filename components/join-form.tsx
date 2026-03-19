"use client";

import { useForm } from "@tanstack/react-form";
import { joinSubmissionSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export function JoinForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      major: "",
      year: "",
      school: "",
      interestInDentistry: "",
      whyDentistry: "",
    },
    onSubmit: async ({ value }) => {
      const result = joinSubmissionSchema.safeParse(value);
      if (!result.success) {
        setStatus("error");
        setErrorMessage(result.error.issues[0]?.message || "Validation failed");
        return;
      }

      try {
        const res = await fetch("/api/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong");
        }

        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
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
          <h2 className="mt-6 text-2xl font-bold">Application Submitted!</h2>
          <p className="mt-3 text-muted-foreground">
            Thank you for your interest in Atlantis Dental Society. We&apos;ll be in touch soon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-none ring-0 shadow-warm">
      <CardContent className="p-8 sm:p-10">
        <h2 className="text-2xl font-extrabold">Application Form</h2>
        <p className="mt-2 text-sm text-muted-foreground">Fill out the form below and we&apos;ll get back to you.</p>

        {status === "error" && (
          <Alert variant="destructive" className="mt-4 rounded-2xl bg-red-500/10 border-none">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <form.Field name="name">
                {(field) => (
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your full name"
                  />
                )}
              </form.Field>
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <form.Field name="email">
                {(field) => (
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="you@example.com"
                  />
                )}
              </form.Field>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Major</Label>
              <form.Field name="major">
                {(field) => (
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Biology"
                  />
                )}
              </form.Field>
            </div>
            <div className="space-y-2">
              <Label>Year of Study</Label>
              <form.Field name="year">
                {(field) => (
                  <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
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
                )}
              </form.Field>
            </div>
          </div>

          <div className="space-y-2">
            <Label>School</Label>
            <form.Field name="school">
              {(field) => (
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. York University"
                />
              )}
            </form.Field>
          </div>

          <div className="space-y-2">
            <Label>What interests you about dentistry?</Label>
            <form.Field name="interestInDentistry">
              {(field) => (
                <Textarea
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tell us about your interest in dentistry..."
                />
              )}
            </form.Field>
          </div>

          <div className="space-y-2">
            <Label>Why do you want to become a dentist?</Label>
            <form.Field name="whyDentistry">
              {(field) => (
                <Textarea
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Share your motivation..."
                />
              )}
            </form.Field>
          </div>

          <Button type="submit" className="w-full rounded-full py-6 text-base gap-2 shadow-gold" size="lg">
            <Send className="h-4 w-4" />
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
