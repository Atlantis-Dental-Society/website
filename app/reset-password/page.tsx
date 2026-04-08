"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod/v4";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Leaf, Loader2, Eye, EyeOff } from "lucide-react";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Invalid or missing reset token.");
        return;
      }
      setSubmitting(true);
      try {
        const { error: authError } = await authClient.resetPassword({
          newPassword: value.password,
          token,
        });
        if (authError) {
          toast.error(authError.message ?? "Something went wrong");
          return;
        }
        setSuccess(true);
        toast.success("Your password has been reset successfully.");
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!token) {
    return (
      <div className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md rounded-3xl border-none shadow-warm-lg">
          <CardContent className="p-8 sm:p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Invalid or expired reset link. Please request a new one.
            </p>
            <Button asChild variant="ghost" className="mt-6 rounded-full">
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="blob-shape-2 absolute -top-24 -left-24 h-80 w-80 bg-secondary/5" />
        <div className="blob-shape-3 absolute -bottom-24 -right-24 h-72 w-72 bg-accent/5" />
      </div>

      <Card className="w-full max-w-md rounded-3xl border-none shadow-warm-lg">
        <CardContent className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold">Reset Password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a new password for your account
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Your password has been reset successfully.
              </p>
              <Button asChild className="mt-6 rounded-full px-8 py-6 text-base shadow-gold" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <form.Field name="password">
                {(f) => {
                  const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid || undefined}>
                      <FieldLabel htmlFor="reset-password">New Password</FieldLabel>
                      <div className="relative">
                        <Input
                          id="reset-password"
                          type={showPassword ? "text" : "password"}
                          value={f.state.value}
                          onBlur={f.handleBlur}
                          onChange={(e) => f.handleChange(e.target.value)}
                          placeholder="At least 8 characters"
                          aria-invalid={isInvalid || undefined}
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {isInvalid && <FieldError errors={f.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="confirmPassword">
                {(f) => {
                  const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid || undefined}>
                      <FieldLabel htmlFor="reset-confirm">Confirm Password</FieldLabel>
                      <div className="relative">
                        <Input
                          id="reset-confirm"
                          type={showConfirm ? "text" : "password"}
                          value={f.state.value}
                          onBlur={f.handleBlur}
                          onChange={(e) => f.handleChange(e.target.value)}
                          placeholder="Re-enter your password"
                          aria-invalid={isInvalid || undefined}
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
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
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
