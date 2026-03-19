import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, CalendarDays, BookOpen, Handshake, Users, HeartHandshake, FolderOpen } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getPageContent, getSections } from "@/lib/tina";
import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { eq } from "drizzle-orm";

const sectionIcons: Record<string, React.ElementType> = {
  welcome: Sparkles,
  "what-we-offer": BookOpen,
  "events-teaser": CalendarDays,
  support: HeartHandshake,
  resources: FolderOpen,
  partner: Handshake,
  "join-cta": Users,
};

export default async function HomePage() {
  const page = await getPageContent("home");
  const upcomingEvents = await db
    .select()
    .from(events)
    .where(eq(events.published, true))
    .orderBy(events.date)
    .limit(3);

  const hero = page?.hero;
  const sections = getSections(page);

  return (
    <>
      <PageHero
        badge={hero?.badge}
        badgeIcon={<Sparkles className="h-4 w-4" />}
        badgeClassName="mb-6 bg-primary/10 text-primary"
        headline={hero?.headline}
        headlineClassName="tracking-tight lg:text-6xl leading-[1.1]"
        subheadline={hero?.subheadline}
        subheadlineClassName="mt-6 max-w-2xl"
        className="py-28 sm:py-36 lg:py-44"
        blobs={
          <>
            <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-primary/8 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] blob-shape-2 bg-sage/10 blur-3xl" />
            <div className="absolute top-1/2 right-1/4 h-72 w-72 blob-shape-3 bg-terracotta/6 blur-3xl" />
          </>
        }
      >
        <div className="mt-10 flex flex-wrap gap-4">
          {hero?.ctaPrimary && (
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-base gap-2 shadow-gold">
              <Link href={hero.ctaPrimaryLink || "/events"}>
                {hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {hero?.ctaSecondary && (
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-base">
              <Link href={hero.ctaSecondaryLink || "/contact"}>{hero.ctaSecondary}</Link>
            </Button>
          )}
        </div>
      </PageHero>

      {sections.map((section, i) => {
        const Icon = sectionIcons[section.id ?? ""] || Sparkles;
        const isAlt = i % 2 === 1;

        if (section.id === "events-teaser") {
          return (
            <EventsTeaserSection
              key={section.id}
              heading={section.heading}
              body={section.body}
              events={upcomingEvents}
            />
          );
        }

        if (section.id === "join-cta") {
          return <CTASection key={section.id} heading={section.heading} body={section.body} />;
        }

        return (
          <ContentSection key={section.id} icon={Icon} heading={section.heading} body={section.body} alt={isAlt} />
        );
      })}
    </>
  );
}

function EventsTeaserSection({ heading, body, events: upcomingEvents }: {
  heading?: string | null;
  body?: string | null;
  events: (typeof events.$inferSelect)[];
}) {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-muted/10" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">{heading}</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mb-10">{body}</p>

        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {upcomingEvents.map((e) => (
              <Card key={e.id} className="rounded-3xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all">
                <CardContent className="p-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                    <span className="text-lg font-extrabold text-primary">
                      {new Date(e.date + "T00:00:00").getDate()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {new Date(e.date + "T00:00:00").toLocaleDateString("en", { dateStyle: "long" })}
                    {e.location && ` — ${e.location}`}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
        )}

        <div className="mt-8">
          <Button asChild variant="outline" className="rounded-full gap-2">
            <Link href="/events">View All Events <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CTASection({ heading, body }: { heading?: string | null; body?: string | null }) {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Card className="relative overflow-hidden rounded-[2.5rem] border-none ring-0 bg-gradient-to-br from-primary/10 via-primary/5 to-sage/10">
          <CardContent className="p-12 sm:p-16 text-center">
            <div className="absolute -top-10 -right-10 h-40 w-40 blob-shape-1 bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 blob-shape-2 bg-sage/10 blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold sm:text-4xl">{heading}</h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">{body}</p>
              <Button asChild size="lg" className="mt-10 rounded-full px-10 py-6 text-base gap-2 shadow-gold">
                <Link href="/join">Join ADS <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ContentSection({ icon: Icon, heading, body, alt }: {
  icon: React.ElementType;
  heading?: string | null;
  body?: string | null;
  alt: boolean;
}) {
  return (
    <section className={`py-24 sm:py-28 ${alt ? "relative overflow-hidden" : ""}`}>
      {alt && <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-muted/10" />}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">{heading}</h2>
          </div>
          <p className="mt-4 text-muted-foreground leading-relaxed">{body}</p>
        </div>
      </div>
    </section>
  );
}
