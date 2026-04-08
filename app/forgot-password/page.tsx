"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { z } from "zod/v4";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Leaf, Loader2, ArrowLeft } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setSubmitting(true);
      try {
        const { error: authError } = await authClient.requestPasswordReset({
          email: value.email,
          redirectTo: "/reset-password",
        });
        if (authError) {
          toast.error(authError.message ?? "Something went wrong");
          return;
        }
        setSent(true);
        toast.success("If an account exists with that email, you'll receive a reset link shortly.");
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="blob-shape-2 absolute -top-24 -left-24 h-80 w-80 bg-secondary/5" />
        <div className="blob-shape-3 absolute -bottom-24 -right-24 h-72 w-72 bg-accent/5" />
      </div>

      <Card className="w-full max-w-md rounded-3xl border-none shadow-warm-lg">
        <CardContent className="p-8 sm:p-10 flex flex-col justify-center min-h-[360px]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold">Forgot Password</h1>
            {!sent && (
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a reset link
              </p>
            )}
          </div>

          {sent ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground text-center">
                Check your inbox for a password reset link.
              </p>
              <Button asChild variant="ghost" className="mt-6 rounded-full">
                <Link href="/login">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <form.Field name="email">
                  {(f) => {
                    const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid || undefined}>
                        <FieldLabel htmlFor="forgot-email">Email Address</FieldLabel>
                        <Input
                          id="forgot-email"
                          type="email"
                          value={f.state.value}
                          onBlur={f.handleBlur}
                          onChange={(e) => f.handleChange(e.target.value)}
                          placeholder="you@example.com"
                          aria-invalid={isInvalid || undefined}
                          autoComplete="email"
                        />
                        {isInvalid && <FieldError errors={f.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full rounded-full py-6 text-base shadow-gold"
                  size="lg"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
