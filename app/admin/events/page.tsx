"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventForm, type Event } from "@/components/admin/event-form";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editing, setEditing] = useState<Event | null>(null);
  const [open, setOpen] = useState(false);

  const loadEvents = async () => {
    const res = await fetch("/api/events");
    if (res.ok) setEvents(await res.json());
  };

  useEffect(() => { loadEvents(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    loadEvents();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold">Manage Events</h1>
        <Button className="rounded-full gap-2" onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <EventForm initial={editing} onDone={() => { setOpen(false); setEditing(null); loadEvents(); }} />
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {events.map((e) => (
          <Card key={e.id} className="rounded-2xl border-none ring-0 shadow-warm">
            <CardContent className="flex items-start justify-between p-6">
              <div>
                <h3 className="font-bold text-lg">{e.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{e.date} {e.time && `| ${e.time}`} {e.location && `| ${e.location}`}</p>
                {e.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{e.description}</p>}
                <div className="mt-2 flex gap-2">
                  {e.published && <Badge variant="secondary" className="h-auto rounded-full bg-sage/15 px-2 py-0.5 text-xs text-sage">Published</Badge>}
                  {e.featured && <Badge variant="secondary" className="h-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Featured</Badge>}
                  {e.category && <Badge variant="secondary" className="h-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{e.category}</Badge>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(e); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(e.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {events.length === 0 && <p className="text-muted-foreground text-center py-12">No events yet.</p>}
      </div>
    </div>
  );
}
