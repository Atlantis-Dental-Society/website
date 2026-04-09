import { getPageContent } from "@/lib/content";
import { db } from "@/lib/db";
import { events, photos } from "@/lib/schema";
import { eq, and, inArray } from "drizzle-orm";
import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { EventCard } from "@/components/event-card";

export default async function EventsPage() {
  const today = new Date().toISOString().split("T")[0];

  const [page, allEvents] = await Promise.all([
    getPageContent("events"),
    db
      .select()
      .from(events)
      .where(eq(events.published, true))
      .orderBy(events.date),
  ]);
  const hero = page?.hero;

  const upcoming = allEvents.filter((e) => e.date >= today);
  const past = allEvents.filter((e) => e.date < today);

  // Fetch all photos for these events in one query
  const eventIds = allEvents.map((e) => e.id);
  const allPhotos = eventIds.length > 0
    ? await db.select().from(photos).where(and(eq(photos.entityType, "events"), inArray(photos.entityId, eventIds))).orderBy(photos.order)
    : [];
  const photosByEvent = new Map<string, typeof allPhotos>();
  for (const p of allPhotos) {
    const list = photosByEvent.get(p.entityId) ?? [];
    list.push(p);
    photosByEvent.set(p.entityId, list);
  }

  return (
    <>
      <PageHero
        badge={hero?.badge}
        badgeIcon={<CalendarDays className="h-4 w-4" />}
        badgeClassName="bg-terracotta/10 text-terracotta"
        headline={hero?.headline}
        subheadline={hero?.subheadline}
        blobs={
          <>
            <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-primary/6 blur-3xl" />
            <div className="absolute bottom-1/4 -left-32 h-80 w-80 blob-shape-3 bg-sage/8 blur-3xl" />
          </>
        }
      />

      <section className="-mt-8 pb-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Upcoming Events */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold">Upcoming Events</h2>
          </div>

          {upcoming.length === 0 ? (
            <Card className="rounded-2xl border-none ring-0 shadow-warm">
              <CardContent className="flex items-center gap-4 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted shrink-0">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} photos={photosByEvent.get(e.id)} />
              ))}
            </div>
          )}

          {/* Past Events */}
          {past.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-16 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-extrabold">Past Events</h2>
              </div>
              <div className="space-y-6">
                {past.map((e) => (
                  <EventCard key={e.id} event={e} isPast photos={photosByEvent.get(e.id)} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
