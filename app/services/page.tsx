import { getServices } from "@/lib/tina";
import { BookOpen, FlaskConical, Users, BarChart3, Cpu, Calendar, Check } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { BookOpen, FlaskConical, Users, BarChart3, Cpu, Calendar };

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-primary/6 blur-3xl" />
      <div className="absolute bottom-0 -left-32 h-80 w-80 blob-shape-2 bg-terracotta/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            What We Offer
          </div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Our Services</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Comprehensive programs and resources designed to support every aspect of your dental career.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = iconMap[s.icon ?? ""] || BookOpen;
            return (
              <div key={s.title} className="group rounded-3xl bg-card p-8 shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h2 className="mt-5 text-xl font-bold">{s.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                {s.features && s.features.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sage/15">
                          <Check className="h-3 w-3 text-sage" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
