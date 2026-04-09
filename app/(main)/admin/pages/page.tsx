"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PageForm } from "@/components/admin/page-form";
import { Loader2, FileText } from "lucide-react";
import type { HeroData, SectionData } from "@/lib/schema";

interface PageData {
  slug: string;
  title: string;
  description?: string | null;
  hero?: HeroData | null;
  sections?: SectionData[] | null;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PageData | null>(null);
  const [open, setOpen] = useState(false);

  const loadPages = useCallback(async () => {
    const res = await fetch("/api/admin/pages");
    if (res.ok) setPages(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { loadPages(); }, [loadPages]);

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Pages</h1>
        <p className="mt-2 text-muted-foreground">Edit page content, heroes, and sections</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <button
              key={page.slug}
              className="text-left"
              onClick={() => { setEditing(page); setOpen(true); }}
            >
              <Card className="h-full rounded-2xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-lg capitalize">{page.slug}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{page.title}</p>
                  {page.hero?.headline && (
                    <p className="mt-2 text-xs text-muted-foreground truncate">{page.hero.headline}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {(page.sections ?? []).length} section{(page.sections ?? []).length !== 1 ? "s" : ""}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl rounded-2xl">
          {editing && (
            <PageForm
              initial={editing}
              onDone={() => { setOpen(false); loadPages(); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
