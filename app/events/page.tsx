import { getEvents } from "@/lib/tina";
import { CalendarDays, MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-primary/6 blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 h-80 w-80 blob-shape-3 bg-sage/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-4 py-2 text-sm font-medium text-terracotta">
            <CalendarDays className="h-4 w-4" />
            Upcoming Events
          </div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Events</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Conferences, workshops, and networking opportunities designed to advance your skills and career.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {events.map((e) => (
            <div
              key={e.title}
              className="group flex flex-col gap-6 rounded-3xl bg-card p-8 shadow-warm hover:shadow-warm-lg transition-all md:flex-row md:items-start"
            >
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                <span className="text-2xl font-extrabold leading-none">{new Date(e.date).getDate()}</span>
                <span className="text-xs font-bold uppercase mt-1">
                  {new Date(e.date).toLocaleString("en", { month: "short" })}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{e.title}</h2>
                  {e.featured && (
                    <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary shrink-0">
                      <Star className="h-3 w-3 fill-primary" />
                      Featured
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"><CalendarDays className="h-3 w-3" /></div>
                    {new Date(e.date).toLocaleDateString("en", { dateStyle: "long" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"><Clock className="h-3 w-3" /></div>
                    {e.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"><MapPin className="h-3 w-3" /></div>
                    {e.location}
                  </span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{e.description}</p>
                <div className="mt-5 flex items-center gap-3">
                  <Button size="sm" className="rounded-full px-6 shadow-gold">Register</Button>
                  {e.category && (
                    <span className="rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">{e.category}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
