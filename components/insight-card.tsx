import Link from "next/link";
import { CalendarDays, User, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { categoryColors, categoryGradients } from "@/lib/insights-config";
import type { insights } from "@/lib/schema";

interface InsightCardProps {
  post: typeof insights.$inferSelect;
}

export function InsightCard({ post }: InsightCardProps) {
  return (
    <Link href={`/insights/${post.slug}`} className="group">
      <Card className="rounded-3xl border-none ring-0 overflow-hidden shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-1">
        <div className={`aspect-[2/1] bg-gradient-to-br ${categoryGradients[post.category ?? ""] || "from-primary/15 to-sage/10"} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute -top-10 -right-10 h-40 w-40 blob-shape-1 bg-white/10 blur-xl" />
          <span className="text-4xl text-primary/20 font-extrabold">{post.category}</span>
          <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </div>
        </div>
        <CardContent className="p-7">
          {post.category && (
            <Badge variant="secondary" className={`h-auto rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${categoryColors[post.category] || "bg-primary/10 text-primary"}`}>
              {post.category}
            </Badge>
          )}
          <h2 className="mt-3 text-lg font-bold group-hover:text-primary transition-colors leading-snug">{post.title}</h2>
          {post.excerpt && <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>}
          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                  <User className="h-3 w-3" />
                </div>
                {post.author}
              </span>
            )}
            {post.publishedDate && (
              <span className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                  <CalendarDays className="h-3 w-3" />
                </div>
                {new Date(post.publishedDate + "T00:00:00").toLocaleDateString("en", { dateStyle: "medium" })}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
