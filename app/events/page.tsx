import { getPageContent } from "@/lib/tina";
import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { CalendarDays } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EventCard } from "@/components/event-card";

export default async function EventsPage() {
  const page = await getPageContent("events");
  const hero = page?.hero;

  const today = new Date().toISOString().split("T")[0];

  const allEvents = await db
    .select()
    .from(events)
    .where(eq(events.published, true))
    .orderBy(events.date);

  const upcoming = allEvents.filter((e) => e.date >= today);
  const past = allEvents.filter((e) => e.date < today);

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
          <h2 className="text-2xl font-extrabold">Upcoming Events</h2>
          {upcoming.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
          ) : (
            <div className="mt-6 space-y-6">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}

          {past.length > 0 && (
            <>
              <h2 className="mt-16 text-2xl font-extrabold">Past Events</h2>
              <div className="mt-6 space-y-6">
                {past.map((e) => (
                  <EventCard key={e.id} event={e} isPast />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
