import Link from "next/link";
import { getInsights } from "@/lib/tina";
import { CalendarDays, User, ArrowUpRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  Technology: "bg-primary/10 text-primary",
  Clinical: "bg-sage/15 text-sage",
  "Practice Management": "bg-terracotta/10 text-terracotta",
};

const categoryGradients: Record<string, string> = {
  Technology: "from-primary/15 via-primary/5 to-sage/10",
  Clinical: "from-sage/15 via-sage/5 to-primary/10",
  "Practice Management": "from-terracotta/15 via-terracotta/5 to-primary/10",
};

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute -top-32 -left-32 h-96 w-96 blob-shape-2 bg-primary/6 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 blob-shape-1 bg-sage/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Expert Perspectives
          </div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Insights</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Expert perspectives on dental technology, clinical practice, and the business of dentistry.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {insights.map((post) => {
            const slug = post._sys.filename;
            const category = post.category ?? "";
            return (
              <Link
                key={slug}
                href={`/insights/${slug}`}
                className="group rounded-3xl bg-card overflow-hidden shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-1"
              >
                <div className={`aspect-[2/1] bg-gradient-to-br ${categoryGradients[category] || "from-primary/15 to-sage/10"} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute -top-10 -right-10 h-40 w-40 blob-shape-1 bg-white/10 blur-xl" />
                  <span className="text-4xl text-primary/20 font-extrabold">{category}</span>
                  <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="p-7">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${categoryColors[category] || "bg-primary/10 text-primary"}`}>
                    {category}
                  </span>
                  <h2 className="mt-3 text-lg font-bold group-hover:text-primary transition-colors leading-snug">{post.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                        <User className="h-3 w-3" />
                      </div>
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                        <CalendarDays className="h-3 w-3" />
                      </div>
                      {new Date(post.publishedDate).toLocaleDateString("en", { dateStyle: "medium" })}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
