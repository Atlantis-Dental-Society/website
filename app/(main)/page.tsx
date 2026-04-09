import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Sparkles,
  CalendarDays,
  BookOpen,
  Handshake,
  Users,
  HeartHandshake,
  FolderOpen,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getPageContent, getSections, type Section } from "@/lib/content";
import { getIcon } from "@/lib/icons";
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
  const [page, upcomingEvents] = await Promise.all([
    getPageContent("home"),
    db
      .select()
      .from(events)
      .where(eq(events.published, true))
      .orderBy(events.date)
      .limit(3),
  ]);

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
        const id = section.id ?? "";

        if (id === "welcome") return <WelcomeSection key={id} section={section} />;
        if (id === "what-we-offer") return <FeatureGridSection key={id} section={section} color="primary" />;
        if (id === "events-teaser") {
          return (
            <EventsTeaserSection
              key={id}
              heading={section.heading}
              body={section.body}
              events={upcomingEvents}
            />
          );
        }
        if (id === "support") return <SplitFeatureSection key={id} section={section} />;
        if (id === "resources") return <FeatureGridSection key={id} section={section} color="sage" columns={3} />;
        if (id === "partner") return <PartnerCTASection key={id} section={section} />;
        if (id === "join-cta") return <JoinCTASection key={id} section={section} />;

        // Fallback for any unknown section
        const Icon = sectionIcons[id] || Sparkles;
        const isAlt = i % 2 === 1;
        return <FallbackSection key={id} icon={Icon} section={section} alt={isAlt} />;
      })}
    </>
  );
}

/* ── Welcome Section: Left-aligned, no card ── */
function WelcomeSection({ section }: { section: Section }) {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute -top-16 -right-16 h-48 w-48 blob-shape-1 bg-primary/8 blur-3xl" />
      <div className="absolute bottom-26 left-100 h-48 w-48 blob-shape-2 bg-sage/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">{section.heading}</h2>
        </div>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl text-lg">
          {section.body}
        </p>
      </div>
    </section>
  );
}

/* ── Feature Grid Section: Cards with icons in a grid ── */
function FeatureGridSection({
  section,
  color = "primary",
  columns = 3,
}: {
  section: Section;
  color?: "primary" | "sage" | "terracotta";
  columns?: 2 | 3;
}) {
  const items = (section.items ?? []).filter((i): i is NonNullable<typeof i> => !!i);
  const Icon = sectionIcons[section.id ?? ""] || Sparkles;
  const colorMap = {
    primary: { bg: "bg-primary/10", text: "text-primary", gradient: "from-primary/6 to-primary/2" },
    sage: { bg: "bg-sage/10", text: "text-sage", gradient: "from-sage/6 to-sage/2" },
    terracotta: { bg: "bg-terracotta/10", text: "text-terracotta", gradient: "from-terracotta/6 to-terracotta/2" },
  };
  const c = colorMap[color];
  const gridCols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${c.bg}`}>
            <Icon className={`h-5 w-5 ${c.text}`} />
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">{section.heading}</h2>
        </div>
        {section.body && (
          <p className="text-muted-foreground leading-relaxed max-w-2xl mb-10">{section.body}</p>
        )}

        {items.length > 0 && (
          <div className={`grid gap-5 ${gridCols}`}>
            {items.map((item) => {
              const ItemIcon = getIcon(item?.icon);
              return (
                <Card
                  key={item?.title}
                  className="group/feature rounded-2xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-0.5"
                >
                  <CardContent className="p-7">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient}`}>
                      <ItemIcon className={`h-6 w-6 ${c.text}`} />
                    </div>
                    <h3 className="font-bold text-lg">{item?.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item?.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Split Feature Section: Text left, item cards right ── */
function SplitFeatureSection({ section }: { section: Section }) {
  const items = (section.items ?? []).filter((i): i is NonNullable<typeof i> => !!i);

  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Heading + body */}
          <div className="lg:sticky lg:top-32">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-terracotta/10">
                <HeartHandshake className="h-5 w-5 text-terracotta" />
              </div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">{section.heading}</h2>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed text-lg">{section.body}</p>
            <Button asChild variant="outline" className="mt-8 rounded-full gap-2">
              <Link href="/join">Learn More <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          {/* Right: Item cards stacked */}
          {items.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => {
                const ItemIcon = getIcon(item?.icon);
                return (
                  <Card
                    key={item?.title}
                    className="rounded-2xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-0.5"
                  >
                    <CardContent className="p-6">
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta/10 to-terracotta/4">
                        <ItemIcon className="h-5 w-5 text-terracotta" />
                      </div>
                      <h3 className="font-bold">{item?.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {item?.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Events Teaser Section ── */
function EventsTeaserSection({
  heading,
  body,
  events: upcomingEvents,
}: {
  heading?: string | null;
  body?: string | null;
  events: (typeof events.$inferSelect)[];
}) {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />
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
              <Card
                key={e.id}
                className="rounded-3xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-0.5"
              >
                <CardContent className="p-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 mb-4">
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
          <Card className="rounded-2xl border-none ring-0 shadow-warm">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <Button asChild variant="outline" className="rounded-full gap-2">
            <Link href="/events">
              View All Events <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ── Partner CTA Section: Gradient card ── */
function PartnerCTASection({ section }: { section: Section }) {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Card className="relative overflow-hidden rounded-[2rem] border-none ring-0 bg-gradient-to-br from-sage/10 via-sage/5 to-primary/8 shadow-warm-lg">
          <CardContent className="relative p-10 sm:p-14">
            <div className="absolute -top-12 -right-12 h-44 w-44 blob-shape-1 bg-sage/12 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-44 w-44 blob-shape-2 bg-primary/8 blur-3xl" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:gap-12">
              <div className="flex-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15">
                  <Handshake className="h-6 w-6 text-sage" />
                </div>
                <h2 className="text-3xl font-extrabold sm:text-4xl">{section.heading}</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed text-lg max-w-xl">
                  {section.body}
                </p>
              </div>
              <div className="mt-8 lg:mt-0 shrink-0">
                <Button asChild size="lg" className="rounded-full px-10 py-6 text-base gap-2 shadow-gold">
                  <Link href="/partner">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/* ── Join CTA Section: Gradient card centered ── */
function JoinCTASection({ section }: { section: Section }) {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Card className="relative overflow-hidden rounded-[2.5rem] border-none ring-0 bg-gradient-to-br from-primary/10 via-primary/5 to-sage/10">
          <CardContent className="p-12 sm:p-16 text-center">
            <div className="absolute -top-10 -right-10 h-40 w-40 blob-shape-1 bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 blob-shape-2 bg-sage/10 blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold sm:text-4xl">{section.heading}</h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">{section.body}</p>
              <Button asChild size="lg" className="mt-10 rounded-full px-10 py-6 text-base gap-2 shadow-gold">
                <Link href="/join">
                  Join ADS <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/* ── Fallback Section: for any unknown section types ── */
function FallbackSection({
  icon: Icon,
  section,
  alt,
}: {
  icon: React.ElementType;
  section: Section;
  alt: boolean;
}) {
  return (
    <section className={`py-24 sm:py-28 ${alt ? "relative overflow-hidden" : ""}`}>
      {alt && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="rounded-2xl border-none ring-0 shadow-warm max-w-3xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">{section.heading}</h2>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">{section.body}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
