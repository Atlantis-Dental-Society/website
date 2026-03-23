import { db } from "@/lib/db";
import { insights, photos } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArticleRenderer } from "@/components/article-renderer";
import { PhotoGallery } from "@/components/photo-gallery";
import { categoryGradients } from "@/lib/insights-config";

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const results = await db
    .select()
    .from(insights)
    .where(eq(insights.slug, slug))
    .limit(1);

  const post = results[0];
  if (!post) notFound();

  const postPhotos = await db
    .select()
    .from(photos)
    .where(and(eq(photos.entityType, "insights"), eq(photos.entityId, post.id)))
    .orderBy(photos.order);

  return (
    <article className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <Button asChild variant="ghost" className="mb-10 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10">
          <Link href="/insights">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Insights
          </Link>
        </Button>

        <div className={`aspect-[2/1] rounded-3xl bg-gradient-to-br ${categoryGradients[post.category ?? ""] || "from-primary/15 to-sage/10"} flex items-center justify-center mb-10 relative overflow-hidden`}>
          <div className="absolute -top-10 -right-10 h-40 w-40 blob-shape-1 bg-warm-cream/10 blur-xl" />
          <span className="text-5xl text-primary/20 font-extrabold">{post.category}</span>
        </div>

        {post.category && (
          <Badge variant="secondary" className="h-auto rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">{post.category}</Badge>
        )}
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl leading-tight">{post.title}</h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {post.author && (
            <span className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-sage/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="font-bold text-foreground block">{post.author}</span>
                {post.authorPosition && <span className="text-xs">{post.authorPosition}</span>}
              </div>
            </span>
          )}
          {post.publishedDate && (
            <span className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                <CalendarDays className="h-3 w-3" />
              </div>
              Published {new Date(post.publishedDate + "T00:00:00").toLocaleDateString("en", { dateStyle: "long" })}
            </span>
          )}
        </div>

        <Separator className="mt-10 bg-gradient-to-r from-transparent via-border to-transparent" />

        {postPhotos.length > 0 && (
          <div className="mt-10">
            <PhotoGallery photos={postPhotos} />
          </div>
        )}

        {post.body && <ArticleRenderer body={post.body} />}
      </div>
    </article>
  );
}
