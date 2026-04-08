"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod/v4";
import { isValidPhoneNumber } from "libphonenumber-js";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine((val) => isValidPhoneNumber(val, "CA"), {
        message: "Please enter a valid phone number (e.g. +1 416 555 0123)",
      }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupInput = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    } as SignupInput,
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitting(true);
      try {
        const { error: authError } = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          phone: value.phone,
        });

        if (authError) {
          toast.error(authError.message ?? "Something went wrong");
          return;
        }

        router.push("/admin");
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
        <div className="blob-shape-1 absolute -top-32 -right-32 h-96 w-96 bg-primary/5" />
        <div className="blob-shape-2 absolute -bottom-32 -left-32 h-80 w-80 bg-secondary/5" />
      </div>

      <Card className="w-full max-w-md rounded-3xl border-none shadow-warm-lg">
        <CardContent className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold">Create an Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join Atlantis Dental Society
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field name="name">
              {(f) => {
                const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid || undefined}>
                    <FieldLabel htmlFor="signup-name">Full Name</FieldLabel>
                    <Input
                      id="signup-name"
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value)}
                      placeholder="Your full name"
                      aria-invalid={isInvalid || undefined}
                      autoComplete="name"
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
                    <FieldLabel htmlFor="signup-email">Email Address</FieldLabel>
                    <Input
                      id="signup-email"
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

            <form.Field name="phone">
              {(f) => {
                const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid || undefined}>
                    <FieldLabel htmlFor="signup-phone">WhatsApp Phone Number</FieldLabel>
                    <Input
                      id="signup-phone"
                      type="tel"
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value)}
                      placeholder="+1 (234) 567-8900"
                      aria-invalid={isInvalid || undefined}
                      autoComplete="tel"
                    />
                    {isInvalid && <FieldError errors={f.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="password">
              {(f) => {
                const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid || undefined}>
                    <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="signup-password"
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
                    <FieldLabel htmlFor="signup-confirm">Confirm Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="signup-confirm"
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
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
