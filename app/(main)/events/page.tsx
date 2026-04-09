import { getPageContent, getSections } from "@/lib/content";
import { getIcon } from "@/lib/icons";
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
  const sections = getSections(page);
  const upcomingSection = sections.find((s) => s.id === "upcoming");
  const pastSection = sections.find((s) => s.id === "past");
  const displaySections = sections.filter((s) => s.id !== "upcoming" && s.id !== "past");

  const upcoming = allEvents.filter((e) => e.date >= today);
  const past = allEvents.filter((e) => e.date < today);

  // Batch-fetch all photos for displayed events
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
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold">{upcomingSection?.heading || "Upcoming Events"}</h2>
          </div>

          {upcoming.length === 0 ? (
            <Card className="rounded-2xl border-none ring-0 shadow-warm">
              <CardContent className="flex items-center gap-4 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted shrink-0">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">{upcomingSection?.body || "No upcoming events at the moment. Check back soon!"}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} photos={photosByEvent.get(e.id)} />
              ))}
            </div>
          )}

          {past.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-16 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-extrabold">{pastSection?.heading || "Past Events"}</h2>
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

      {/* Dynamic sections from admin */}
      {displaySections
        .filter((s) => s.items && s.items.length > 0)
        .map((section, idx) => {
          const items = (section.items ?? []).filter((i): i is NonNullable<typeof i> => !!i);
          const isAlt = idx % 2 === 0;
          const color = isAlt ? "primary" : "sage";
          const colorMap = {
            primary: { text: "text-primary", gradient: "from-primary/8 to-primary/3" },
            sage: { text: "text-sage", gradient: "from-sage/8 to-sage/3" },
          };
          const c = colorMap[color];

          return (
            <section key={section.id} className="relative py-24 sm:py-28 overflow-hidden">
              {isAlt && <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />}
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mb-10">
                  <h2 className="text-3xl font-extrabold sm:text-4xl">{section.heading}</h2>
                  {section.body && (
                    <p className="mt-4 text-muted-foreground leading-relaxed text-lg">{section.body}</p>
                  )}
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => {
                    const ItemIcon = getIcon(item?.icon);
                    return (
                      <Card key={item?.title} className="rounded-2xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-0.5">
                        <CardContent className="p-7">
                          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient}`}>
                            <ItemIcon className={`h-6 w-6 ${c.text}`} />
                          </div>
                          <h3 className="font-bold text-lg">{item?.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item?.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}

      {displaySections.filter((s) => !s.items || s.items.length === 0).length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            {displaySections
              .filter((s) => !s.items || s.items.length === 0)
              .map((section) => (
                <Card key={section.id} className="rounded-2xl border-none ring-0 shadow-warm">
                  <CardContent className="p-8 sm:p-10">
                    <h2 className="text-2xl font-extrabold sm:text-3xl">{section.heading}</h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{section.body}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      )}
    </>
  );
}
