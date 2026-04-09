"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Plus, Trash2, Loader2, GripVertical } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { HeroData, SectionData, SectionItem } from "@/lib/schema";

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

export default function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hero, setHero] = useState<HeroData>({});
  const [sections, setSections] = useState<SectionData[]>([]);

  useEffect(() => {
    fetch(`/api/admin/pages/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data: PageData | null) => {
        if (!data) { router.push("/admin/pages"); return; }
        setTitle(data.title);
        setDescription(data.description ?? "");
        setHero(data.hero ?? {});
        setSections(data.sections ?? []);
        setLoading(false);
      })
      .catch(() => router.push("/admin/pages"));
  }, [slug, router]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, hero, sections }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
        return;
      }
      toast.success("Page saved");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (field: keyof HeroData, value: string) => {
    setHero((h) => ({ ...h, [field]: value }));
  };

  const addSection = () => {
    setSections((s) => [...s, { id: "", heading: "", body: "", items: [] }]);
  };

  const removeSection = (index: number) => {
    setSections((s) => s.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof SectionData, value: string) => {
    setSections((s) => s.map((sec, i) => i === index ? { ...sec, [field]: value } : sec));
  };

  const addItem = (si: number) => {
    setSections((s) => s.map((sec, i) =>
      i === si ? { ...sec, items: [...(sec.items ?? []), { title: "", description: "", icon: "" }] } : sec
    ));
  };

  const removeItem = (si: number, ii: number) => {
    setSections((s) => s.map((sec, i) =>
      i === si ? { ...sec, items: (sec.items ?? []).filter((_, j) => j !== ii) } : sec
    ));
  };

  const updateItem = (si: number, ii: number, field: keyof SectionItem, value: string) => {
    setSections((s) => s.map((sec, i) =>
      i === si ? { ...sec, items: (sec.items ?? []).map((item, j) => j === ii ? { ...item, [field]: value } : item) } : sec
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => router.push("/admin/pages")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold sm:text-3xl capitalize">{slug}</h1>
          <p className="mt-1 text-muted-foreground">Edit page content</p>
        </div>
        <Button onClick={save} disabled={saving} className="rounded-full px-8">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["info", "hero"]} className="space-y-4">
        {/* Page Info */}
        <AccordionItem value="info" className="border-none">
          <Card className="rounded-2xl border-none ring-0 shadow-warm overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-bold">Page Info</span>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="px-6 pb-6 pt-0">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="pg-title">Title</FieldLabel>
                    <Input id="pg-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="pg-desc">Description</FieldLabel>
                    <Textarea id="pg-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
                  </Field>
                </FieldGroup>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Hero Section */}
        <AccordionItem value="hero" className="border-none">
          <Card className="rounded-2xl border-none ring-0 shadow-warm overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-bold">Hero Section</span>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="px-6 pb-6 pt-0">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Badge</FieldLabel>
                    <Input value={hero.badge ?? ""} onChange={(e) => updateHero("badge", e.target.value)} placeholder="e.g. Our Events" />
                  </Field>
                  <Field>
                    <FieldLabel>Headline</FieldLabel>
                    <Input value={hero.headline ?? ""} onChange={(e) => updateHero("headline", e.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel>Subheadline</FieldLabel>
                    <Textarea value={hero.subheadline ?? ""} onChange={(e) => updateHero("subheadline", e.target.value)} rows={2} />
                  </Field>
                  <Separator />
                  <FieldGroup className="flex-row">
                    <Field>
                      <FieldLabel>Primary CTA</FieldLabel>
                      <Input value={hero.ctaPrimary ?? ""} onChange={(e) => updateHero("ctaPrimary", e.target.value)} placeholder="Button text" />
                    </Field>
                    <Field>
                      <FieldLabel>Primary CTA Link</FieldLabel>
                      <Input value={hero.ctaPrimaryLink ?? ""} onChange={(e) => updateHero("ctaPrimaryLink", e.target.value)} placeholder="/events" />
                    </Field>
                  </FieldGroup>
                  <FieldGroup className="flex-row">
                    <Field>
                      <FieldLabel>Secondary CTA</FieldLabel>
                      <Input value={hero.ctaSecondary ?? ""} onChange={(e) => updateHero("ctaSecondary", e.target.value)} placeholder="Button text" />
                    </Field>
                    <Field>
                      <FieldLabel>Secondary CTA Link</FieldLabel>
                      <Input value={hero.ctaSecondaryLink ?? ""} onChange={(e) => updateHero("ctaSecondaryLink", e.target.value)} placeholder="/contact" />
                    </Field>
                  </FieldGroup>
                </FieldGroup>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Sections */}
        {sections.map((section, si) => (
          <AccordionItem key={si} value={`section-${si}`} className="border-none">
            <Card className="rounded-2xl border-none ring-0 shadow-warm overflow-hidden">
              <div className="flex items-center">
                <AccordionTrigger className="flex-1 px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold">{section.heading || section.id || `Section ${si + 1}`}</span>
                    {(section.items ?? []).length > 0 && (
                      <span className="text-xs text-muted-foreground">({(section.items ?? []).length} items)</span>
                    )}
                  </div>
                </AccordionTrigger>
                <Button type="button" variant="ghost" size="icon" className="mr-4 text-destructive hover:text-destructive" onClick={() => removeSection(si)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <AccordionContent>
                <CardContent className="px-6 pb-6 pt-0">
                  <FieldGroup>
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
                      <Textarea value={section.body ?? ""} onChange={(e) => updateSection(si, "body", e.target.value)} rows={3} />
                    </Field>
                  </FieldGroup>

                  {/* Items */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold">Items</span>
                      <Button type="button" variant="outline" size="sm" className="rounded-full gap-1" onClick={() => addItem(si)}>
                        <Plus className="h-3 w-3" /> Add Item
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {(section.items ?? []).map((item, ii) => {
                        const IconPreview = getIcon(item.icon);
                        return (
                          <div key={ii} className="rounded-xl border border-border/50 p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-1 space-y-3">
                                <FieldGroup className="flex-row">
                                  <Field>
                                    <FieldLabel>Title</FieldLabel>
                                    <Input value={item.title ?? ""} onChange={(e) => updateItem(si, ii, "title", e.target.value)} />
                                  </Field>
                                  <Field>
                                    <FieldLabel>Icon</FieldLabel>
                                    <Select value={item.icon ?? ""} onValueChange={(v) => updateItem(si, ii, "icon", v)}>
                                      <SelectTrigger>
                                        <div className="flex items-center gap-2">
                                          <IconPreview className="h-4 w-4 text-primary" />
                                          <SelectValue placeholder="Choose icon" />
                                        </div>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {iconNames.map((name) => {
                                          const Icon = getIcon(name);
                                          return (
                                            <SelectItem key={name} value={name}>
                                              <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                {name}
                                              </div>
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </Field>
                                </FieldGroup>
                                <Field>
                                  <FieldLabel>Description</FieldLabel>
                                  <Textarea value={item.description ?? ""} onChange={(e) => updateItem(si, ii, "description", e.target.value)} rows={2} />
                                </Field>
                              </div>
                              <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive mt-6" onClick={() => removeItem(si, ii)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Add Section + Save */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" className="rounded-full gap-2" onClick={addSection}>
          <Plus className="h-4 w-4" /> Add Section
        </Button>
        <Button onClick={save} disabled={saving} className="rounded-full px-8">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
