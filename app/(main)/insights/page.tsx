import { getPageContent, getSections } from "@/lib/content";
import { getIcon } from "@/lib/icons";
import { db } from "@/lib/db";
import { insights, photos } from "@/lib/schema";
import { eq, and, inArray } from "drizzle-orm";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { InsightCard } from "@/components/insight-card";

export default async function InsightsPage() {
  const [page, allInsights] = await Promise.all([
    getPageContent("insights"),
    db
      .select()
      .from(insights)
      .where(eq(insights.published, true))
      .orderBy(insights.publishedDate),
  ]);
  const hero = page?.hero;
  const sections = getSections(page);

  const insightIds = allInsights.map((i) => i.id);
  const allPhotos = insightIds.length > 0
    ? await db
        .select({ entityId: photos.entityId, url: photos.url })
        .from(photos)
        .where(and(eq(photos.entityType, "insights"), inArray(photos.entityId, insightIds)))
        .orderBy(photos.order)
    : [];

  const firstPhotoByInsight = new Map<string, string>();
  for (const photo of allPhotos) {
    if (!firstPhotoByInsight.has(photo.entityId)) {
      firstPhotoByInsight.set(photo.entityId, photo.url);
    }
  }

  return (
    <>
      <PageHero
        badge={hero?.badge}
        badgeClassName="bg-primary/10 text-primary"
        headline={hero?.headline}
        subheadline={hero?.subheadline}
        blobs={
          <>
            <div className="absolute -top-32 -left-32 h-96 w-96 blob-shape-2 bg-primary/6 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-80 w-80 blob-shape-1 bg-sage/8 blur-3xl" />
          </>
        }
      />

      <section className="-mt-8 pb-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {allInsights.length === 0 ? (
            <Card className="rounded-2xl border-none ring-0 shadow-warm">
              <CardContent className="flex items-center gap-4 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground">No insights published yet. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {allInsights.map((post) => (
                <InsightCard key={post.slug} post={post} bannerUrl={firstPhotoByInsight.get(post.id) ?? post.coverImageUrl ?? undefined} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dynamic sections from admin */}
      {sections
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

      {sections.filter((s) => !s.items || s.items.length === 0).length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            {sections
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
