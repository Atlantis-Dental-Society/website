import { getPageContent } from "@/lib/content";
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
    </>
  );
}
