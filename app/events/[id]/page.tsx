import { db } from "@/lib/db";
import { events, photos } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, MapPin, Star, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoGallery } from "@/components/photo-gallery";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [event] = await db.select().from(events).where(eq(events.id, id));
  if (!event) notFound();

  const eventPhotos = await db
    .select()
    .from(photos)
    .where(and(eq(photos.entityType, "events"), eq(photos.entityId, event.id)))
    .orderBy(photos.order);

  const dateObj = new Date(event.date + "T00:00:00");

  return (
    <article className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 blob-shape-2 bg-sage/6 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <Button asChild variant="ghost" className="mb-10 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10">
          <Link href="/events">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Events
          </Link>
        </Button>

        {/* Date badge */}
        <div className="flex items-start gap-6 mb-8">
          <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
            <span className="text-2xl font-extrabold leading-none">{dateObj.getDate()}</span>
            <span className="text-xs font-bold uppercase mt-1">
              {dateObj.toLocaleString("en", { month: "short" })}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-extrabold sm:text-4xl leading-tight">{event.title}</h1>
              {event.featured && (
                <Badge variant="secondary" className="h-auto shrink-0 gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  <Star className="h-3 w-3 fill-primary" />
                  Featured
                </Badge>
              )}
            </div>
            {event.category && (
              <Badge variant="secondary" className="mt-3 h-auto rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">{event.category}</Badge>
            )}
          </div>
        </div>

        {/* Event details card */}
        <Card className="rounded-2xl border-none ring-0 shadow-warm mb-10">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <span className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block">Date</span>
                  <span className="font-medium">
                    {dateObj.toLocaleDateString("en", { dateStyle: "long" })}
                    {event.endDate && ` — ${new Date(event.endDate + "T00:00:00").toLocaleDateString("en", { dateStyle: "long" })}`}
                  </span>
                </div>
              </span>

              {event.time && (
                <span className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">Time</span>
                    <span className="font-medium">{event.time}</span>
                  </div>
                </span>
              )}

              {event.location && (
                <span className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">Location</span>
                    <span className="font-medium">{event.location}</span>
                  </div>
                </span>
              )}
            </div>

            {event.registrationUrl && (
              <Button asChild className="rounded-full px-6 shadow-gold gap-2">
                <Link href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                  Register <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        {event.description && (
          <div className="mb-10">
            <p className="text-muted-foreground leading-relaxed text-lg">{event.description}</p>
          </div>
        )}

        {/* Photo gallery */}
        {eventPhotos.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Photos</h2>
            <PhotoGallery photos={eventPhotos} />
          </div>
        )}
      </div>
    </article>
  );
}
