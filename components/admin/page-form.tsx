"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { pageContentSchema, type PageContentInput } from "@/lib/validations";
import type { HeroData, SectionData, SectionItem } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";

const iconNames = [
  "CalendarDays", "HeartHandshake", "GraduationCap", "FileCheck", "Handshake",
  "Users", "BookOpen", "Lightbulb", "MessageSquare", "ClipboardList",
  "FileText", "CheckSquare", "Sparkles", "Stethoscope", "FlaskConical",
  "Award", "Link2", "FolderOpen", "UserCheck", "Target", "Globe",
  "Building2", "Megaphone", "PresentationIcon",
];

interface PageData {
  slug: string;
  title: string;
  description?: string | null;
  hero?: HeroData | null;
  sections?: SectionData[] | null;
}

interface PageFormProps {
  initial: PageData;
  onDone: () => void;
}

export function PageForm({ initial, onDone }: PageFormProps) {
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<SectionData[]>(initial.sections ?? []);

  const form = useForm({
    defaultValues: {
      title: initial.title ?? "",
      description: initial.description ?? "",
      hero: {
        badge: initial.hero?.badge ?? "",
        headline: initial.hero?.headline ?? "",
        subheadline: initial.hero?.subheadline ?? "",
        ctaPrimary: initial.hero?.ctaPrimary ?? "",
        ctaPrimaryLink: initial.hero?.ctaPrimaryLink ?? "",
        ctaSecondary: initial.hero?.ctaSecondary ?? "",
        ctaSecondaryLink: initial.hero?.ctaSecondaryLink ?? "",
      },
    } as PageContentInput,
    validators: {
      onSubmit: pageContentSchema,
    },
    onSubmit: async ({ value }) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/admin/pages/${initial.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...value, sections }),
        });
        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Failed to save");
          return;
        }
        onDone();
      } catch {
        toast.error("Something went wrong");
      } finally {
        setSaving(false);
      }
    },
  });

  const addSection = () => {
    setSections([...sections, { id: "", heading: "", body: "", items: [] }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof SectionData, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const addItem = (sectionIndex: number) => {
    const updated = [...sections];
    const items = [...(updated[sectionIndex].items ?? [])];
    items.push({ title: "", description: "", icon: "" });
    updated[sectionIndex] = { ...updated[sectionIndex], items };
    setSections(updated);
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const updated = [...sections];
    const items = [...(updated[sectionIndex].items ?? [])];
    items.splice(itemIndex, 1);
    updated[sectionIndex] = { ...updated[sectionIndex], items };
    setSections(updated);
  };

  const updateItem = (sectionIndex: number, itemIndex: number, field: keyof SectionItem, value: string) => {
    const updated = [...sections];
    const items = [...(updated[sectionIndex].items ?? [])];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    updated[sectionIndex] = { ...updated[sectionIndex], items };
    setSections(updated);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <DialogHeader>
        <DialogTitle>Edit Page: {initial.slug}</DialogTitle>
        <DialogDescription>Update the content for the {initial.slug} page.</DialogDescription>
      </DialogHeader>

      <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-6 pr-2">
        {/* Page Info */}
        <FieldGroup>
          <form.Field name="title">
            {(f) => {
              const isInvalid = f.state.meta.isTouched && !f.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="pg-title">Title *</FieldLabel>
                  <Input id="pg-title" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} aria-invalid={isInvalid || undefined} />
                  {isInvalid && <FieldError errors={f.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="description">
            {(f) => (
              <Field>
                <FieldLabel htmlFor="pg-desc">Description</FieldLabel>
                <Textarea id="pg-desc" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} rows={2} />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        {/* Hero */}
        <div>
          <Separator className="mb-4" />
          <h3 className="text-sm font-bold mb-3">Hero Section</h3>
          <FieldGroup>
            <form.Field name="hero.badge">
              {(f) => (
                <Field>
                  <FieldLabel htmlFor="pg-badge">Badge</FieldLabel>
                  <Input id="pg-badge" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="e.g. Our Events" />
                </Field>
              )}
            </form.Field>
            <form.Field name="hero.headline">
              {(f) => (
                <Field>
                  <FieldLabel htmlFor="pg-headline">Headline</FieldLabel>
                  <Input id="pg-headline" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} />
                </Field>
              )}
            </form.Field>
            <form.Field name="hero.subheadline">
              {(f) => (
                <Field>
                  <FieldLabel htmlFor="pg-subheadline">Subheadline</FieldLabel>
                  <Textarea id="pg-subheadline" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} rows={2} />
                </Field>
              )}
            </form.Field>
            <FieldGroup className="flex-row">
              <form.Field name="hero.ctaPrimary">
                {(f) => (
                  <Field>
                    <FieldLabel htmlFor="pg-cta1">Primary CTA</FieldLabel>
                    <Input id="pg-cta1" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="Button text" />
                  </Field>
                )}
              </form.Field>
              <form.Field name="hero.ctaPrimaryLink">
                {(f) => (
                  <Field>
                    <FieldLabel htmlFor="pg-cta1-link">Primary CTA Link</FieldLabel>
                    <Input id="pg-cta1-link" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="/events" />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
            <FieldGroup className="flex-row">
              <form.Field name="hero.ctaSecondary">
                {(f) => (
                  <Field>
                    <FieldLabel htmlFor="pg-cta2">Secondary CTA</FieldLabel>
                    <Input id="pg-cta2" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="Button text" />
                  </Field>
                )}
              </form.Field>
              <form.Field name="hero.ctaSecondaryLink">
                {(f) => (
                  <Field>
                    <FieldLabel htmlFor="pg-cta2-link">Secondary CTA Link</FieldLabel>
                    <Input id="pg-cta2-link" value={f.state.value} onBlur={f.handleBlur} onChange={(e) => f.handleChange(e.target.value)} placeholder="/contact" />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </FieldGroup>
        </div>

        {/* Sections */}
        <div>
          <Separator className="mb-4" />
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Sections</h3>
            <Button type="button" variant="outline" size="sm" className="rounded-full gap-1" onClick={addSection}>
              <Plus className="h-3 w-3" /> Add Section
            </Button>
          </div>

          <div className="space-y-4">
            {sections.map((section, si) => (
              <div key={si} className="rounded-xl border border-border/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Section {si + 1}</span>
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => removeSection(si)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <FieldGroup className="flex-row">
                  <Field>
                    <FieldLabel>ID</FieldLabel>
                    <Input value={section.id ?? ""} onChange={(e) => updateSection(si, "id", e.target.value)} placeholder="e.g. welcome" />
                  </Field>
                  <Field>
                    <FieldLabel>Heading</FieldLabel>
                    <Input value={section.heading ?? ""} onChange={(e) => updateSection(si, "heading", e.target.value)} />
                  </Field>
                </FieldGroup>

                <Field>
                  <FieldLabel>Body</FieldLabel>
                  <Textarea value={section.body ?? ""} onChange={(e) => updateSection(si, "body", e.target.value)} rows={2} />
                </Field>

                {/* Items */}
                <div className="pl-4 border-l-2 border-border/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Items</span>
                    <Button type="button" variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => addItem(si)}>
                      <Plus className="h-3 w-3" /> Item
                    </Button>
                  </div>
                  {(section.items ?? []).map((item, ii) => (
                    <div key={ii} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <FieldGroup className="flex-row">
                          <Field>
                            <Input value={item.title ?? ""} onChange={(e) => updateItem(si, ii, "title", e.target.value)} placeholder="Title" />
                          </Field>
                          <Field>
                            <Select value={item.icon ?? ""} onValueChange={(v) => updateItem(si, ii, "icon", v)}>
                              <SelectTrigger><SelectValue placeholder="Icon" /></SelectTrigger>
                              <SelectContent>
                                {iconNames.map((name) => (
                                  <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        </FieldGroup>
                        <Textarea value={item.description ?? ""} onChange={(e) => updateItem(si, ii, "description", e.target.value)} placeholder="Description" rows={1} />
                      </div>
                      <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive shrink-0 mt-1" onClick={() => removeItem(si, ii)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter className="mt-4">
        <Button type="submit" disabled={saving} className="rounded-full px-8">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
