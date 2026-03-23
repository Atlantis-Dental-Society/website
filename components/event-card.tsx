import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { events } from "@/lib/schema";

interface EventCardProps {
  event: typeof events.$inferSelect;
  isPast?: boolean;
  photos?: { id: string; url: string }[];
}

export function EventCard({ event: e, isPast, photos }: EventCardProps) {
  return (
    <Card className={`group rounded-3xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all ${isPast ? "opacity-70" : ""}`}>
      <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-start">
        <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
          <span className="text-2xl font-extrabold leading-none">{new Date(e.date + "T00:00:00").getDate()}</span>
          <span className="text-xs font-bold uppercase mt-1">
            {new Date(e.date + "T00:00:00").toLocaleString("en", { month: "short" })}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <Link href={`/events/${e.id}`} className="text-xl font-bold group-hover:text-primary transition-colors hover:underline">{e.title}</Link>
            {e.featured && (
              <Badge variant="secondary" className="h-auto shrink-0 gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <Star className="h-3 w-3 fill-primary" />
                Featured
              </Badge>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"><CalendarDays className="h-3 w-3" /></div>
              {new Date(e.date + "T00:00:00").toLocaleDateString("en", { dateStyle: "long" })}
            </span>
            {e.time && (
              <span className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"><Clock className="h-3 w-3" /></div>
                {e.time}
              </span>
            )}
            {e.location && (
              <span className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"><MapPin className="h-3 w-3" /></div>
                {e.location}
              </span>
            )}
          </div>
          {e.description && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{e.description}</p>}

          {/* Photo thumbnails */}
          {photos && photos.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {photos.slice(0, 4).map((photo) => (
                <div key={photo.id} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image src={photo.url} alt="" fill className="object-cover" sizes="64px" />
                </div>
              ))}
              {photos.length > 4 && (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground font-medium">
                  +{photos.length - 4}
                </div>
              )}
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            {e.registrationUrl && !isPast && (
              <Button size="sm" className="rounded-full px-6 shadow-gold" asChild>
                <Link href={e.registrationUrl} target="_blank" rel="noopener noreferrer">Register</Link>
              </Button>
            )}
            {e.category && (
              <Badge variant="secondary" className="h-auto rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">{e.category}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
