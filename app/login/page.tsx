"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod/v4";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Leaf, Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginInput,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitting(true);
      try {
        const { error: authError } = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });

        if (authError) {
          toast.error(authError.message ?? "Invalid email or password");
          return;
        }

        router.push(callbackUrl);
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
        <CardContent className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account
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
            <form.Field name="email">
              {(f) => {
                const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid || undefined}>
                    <FieldLabel htmlFor="login-email">Email Address</FieldLabel>
                    <Input
                      id="login-email"
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

            <form.Field name="password">
              {(f) => {
                const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid || undefined}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                        placeholder="Your password"
                        aria-invalid={isInvalid || undefined}
                        autoComplete="current-password"
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

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-full py-6 text-base shadow-gold"
              size="lg"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
