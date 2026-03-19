import { getPageContent } from "@/lib/tina";
import { db } from "@/lib/db";
import { insights } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { PageHero } from "@/components/page-hero";
import { InsightCard } from "@/components/insight-card";

export default async function InsightsPage() {
  const page = await getPageContent("insights");
  const hero = page?.hero;

  const allInsights = await db
    .select()
    .from(insights)
    .where(eq(insights.published, true))
    .orderBy(insights.publishedDate);

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
            <p className="text-muted-foreground">No insights published yet. Check back soon!</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {allInsights.map((post) => (
                <InsightCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
