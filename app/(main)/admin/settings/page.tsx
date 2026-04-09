"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { siteConfigSchema, type SiteConfigInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initial, setInitial] = useState<SiteConfigInput | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setInitial(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const form = useForm({
    defaultValues: {
      name: initial?.name ?? "",
      tagline: initial?.tagline ?? "",
      description: initial?.description ?? "",
      logo: initial?.logo ?? "",
      favicon: initial?.favicon ?? "",
      email: initial?.email ?? "",
      instagramUrl: initial?.instagramUrl ?? "",
      instagramHandle: initial?.instagramHandle ?? "",
    } as SiteConfigInput,
    validators: {
      onSubmit: siteConfigSchema,
    },
    onSubmit: async ({ value }) => {
      setSaving(true);
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });
        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Failed to save");
          return;
        }
        toast.success("Settings saved");
      } catch {
        toast.error("Something went wrong");
      } finally {
        setSaving(false);
      }
    },
  });

  useEffect(() => {
    if (initial) {
      form.reset({
        name: initial.name ?? "",
        tagline: initial.tagline ?? "",
        description: initial.description ?? "",
        logo: initial.logo ?? "",
        favicon: initial.favicon ?? "",
        email: initial.email ?? "",
        instagramUrl: initial.instagramUrl ?? "",
        instagramHandle: initial.instagramHandle ?? "",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Site Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your site name, logo, and social links</p>
      </div>

      <Card className="max-w-2xl rounded-2xl border-none ring-0 shadow-warm">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
            <FieldGroup>
              <form.Field name="name">
                {(f) => {
                  const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid || undefined}>
                      <FieldLabel htmlFor="cfg-name">Site Name *</FieldLabel>
                      <Input id="cfg-name" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} aria-invalid={isInvalid || undefined} />
                      {isInvalid && <FieldError errors={f.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="tagline">
                {(f) => (
                  <Field>
                    <FieldLabel htmlFor="cfg-tagline">Tagline</FieldLabel>
                    <Input id="cfg-tagline" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="A short description of your site" />
                  </Field>
                )}
              </form.Field>

              <form.Field name="description">
                {(f) => (
                  <Field>
                    <FieldLabel htmlFor="cfg-description">Description</FieldLabel>
                    <Textarea id="cfg-description" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="A longer description shown in the footer" rows={2} />
                  </Field>
                )}
              </form.Field>

              <FieldGroup className="flex-row">
                <form.Field name="logo">
                  {(f) => (
                    <Field>
                      <FieldLabel htmlFor="cfg-logo">Logo URL</FieldLabel>
                      <Input id="cfg-logo" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="/logo.png" />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="favicon">
                  {(f) => (
                    <Field>
                      <FieldLabel htmlFor="cfg-favicon">Favicon URL</FieldLabel>
                      <Input id="cfg-favicon" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="/logo.png" />
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>

              <form.Field name="email">
                {(f) => {
                  const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid || undefined}>
                      <FieldLabel htmlFor="cfg-email">Email</FieldLabel>
                      <Input type="email" id="cfg-email" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} aria-invalid={isInvalid || undefined} />
                      {isInvalid && <FieldError errors={f.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <FieldGroup className="flex-row">
                <form.Field name="instagramUrl">
                  {(f) => {
                    const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid || undefined}>
                        <FieldLabel htmlFor="cfg-ig-url">Instagram URL</FieldLabel>
                        <Input id="cfg-ig-url" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="https://instagram.com/..." aria-invalid={isInvalid || undefined} />
                        {isInvalid && <FieldError errors={f.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="instagramHandle">
                  {(f) => (
                    <Field>
                      <FieldLabel htmlFor="cfg-ig-handle">Instagram Handle</FieldLabel>
                      <Input id="cfg-ig-handle" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="@yourhandle" />
                    </Field>
                  )}
                </form.Field>
              </FieldGroup>
            </FieldGroup>

            <div className="mt-6">
              <Button type="submit" disabled={saving} className="rounded-full px-8">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
