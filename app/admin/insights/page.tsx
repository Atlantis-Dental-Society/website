"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InsightForm, type Insight } from "@/components/admin/insight-form";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [editing, setEditing] = useState<Insight | null>(null);
  const [open, setOpen] = useState(false);

  const loadInsights = async () => {
    const res = await fetch("/api/insights");
    if (res.ok) setInsights(await res.json());
  };

  useEffect(() => { loadInsights(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this insight?")) return;
    await fetch(`/api/insights/${id}`, { method: "DELETE" });
    loadInsights();
  };

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold">Manage Insights</h1>
        <Button className="rounded-full gap-2" onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Insight
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <InsightForm initial={editing} onDone={() => { setOpen(false); setEditing(null); loadInsights(); }} />
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {insights.map((post) => (
          <Card key={post.id} className="rounded-2xl border-none ring-0 shadow-warm">
            <CardContent className="flex items-start justify-between p-6">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{post.author} {post.publishedDate && `| ${post.publishedDate}`}</p>
                {post.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>}
                <div className="mt-2 flex gap-2">
                  {post.published && <Badge variant="secondary" className="h-auto rounded-full bg-sage/15 px-2 py-0.5 text-xs text-sage">Published</Badge>}
                  {post.category && <Badge variant="secondary" className="h-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{post.category}</Badge>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(post); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {insights.length === 0 && <p className="text-muted-foreground text-center py-12">No insights yet.</p>}
      </div>
    </div>
  );
}
