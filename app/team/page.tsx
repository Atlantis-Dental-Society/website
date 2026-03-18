import { getTeamMembers } from "@/lib/tina";
import { User } from "lucide-react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute -top-32 -left-32 h-96 w-96 blob-shape-2 bg-sage/8 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 blob-shape-1 bg-terracotta/6 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage/10 px-4 py-2 text-sm font-medium text-sage">
            Meet Our Leaders
          </div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Our Team</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Meet the dedicated professionals leading the Atlantis Dental Society.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((m, i) => {
            const blobClass = i % 3 === 0 ? "blob-shape-1" : i % 3 === 1 ? "blob-shape-2" : "blob-shape-3";
            const gradientClass = i % 3 === 0
              ? "from-primary/20 to-sage/15"
              : i % 3 === 1
                ? "from-sage/20 to-terracotta/15"
                : "from-terracotta/20 to-primary/15";
            return (
              <div key={m.name} className="group rounded-3xl bg-card p-8 shadow-warm hover:shadow-warm-lg transition-all">
                <div className={`flex h-24 w-24 items-center justify-center ${blobClass} bg-gradient-to-br ${gradientClass}`}>
                  <User className="h-12 w-12 text-primary/60" />
                </div>
                <h2 className="mt-5 text-xl font-bold">{m.name}</h2>
                <div className="mt-1 text-sm font-semibold text-primary">{m.position}</div>
                <div className="mt-0.5 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{m.specialty}</div>
                <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  <TinaMarkdown content={m.bio} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
