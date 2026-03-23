import { getPageContent, getSections } from "@/lib/tina";
import { getIcon } from "@/lib/icons";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { Globe, Target } from "lucide-react";

const sectionStyles: Record<string, { icon: React.ElementType; color: string; bg: string; gradient: string }> = {
  "who-we-are": { icon: Globe, color: "text-primary", bg: "bg-primary/10", gradient: "from-primary/6 to-primary/2" },
  achieve: { icon: Target, color: "text-sage", bg: "bg-sage/10", gradient: "from-sage/6 to-sage/2" },
};

export default async function AboutPage() {
  const page = await getPageContent("about");
  const hero = page?.hero;
  const sections = getSections(page);

  return (
    <>
      <PageHero
        badge={hero?.badge}
        badgeClassName="bg-sage/10 text-sage"
        headline={hero?.headline}
        subheadline={hero?.subheadline}
        blobs={
          <>
            <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-sage/8 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 blob-shape-2 bg-primary/6 blur-3xl" />
          </>
        }
      />

      {/* Text sections as cards */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {sections
              .filter((s) => !s.items || s.items.length === 0)
              .map((section) => {
                const style = sectionStyles[section.id ?? ""];
                const Icon = style?.icon ?? Globe;
                const iconBg = style?.bg ?? "bg-primary/10";
                const iconColor = style?.color ?? "text-primary";

                return (
                  <Card
                    key={section.id}
                    className="rounded-2xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all"
                  >
                    <CardContent className="p-8 sm:p-10">
                      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                      </div>
                      <h2 className="text-2xl font-extrabold sm:text-3xl">{section.heading}</h2>
                      <p className="mt-4 text-muted-foreground leading-relaxed">{section.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

      {/* Item-based sections as feature grids */}
      {sections
        .filter((s) => s.items && s.items.length > 0)
        .map((section, idx) => {
          const items = (section.items ?? []).filter((i): i is NonNullable<typeof i> => !!i);
          const isAlt = idx % 2 === 0;
          const color = isAlt ? "sage" : "primary";
          const colorMap = {
            sage: { bg: "bg-sage/10", text: "text-sage", gradient: "from-sage/8 to-sage/3" },
            primary: { bg: "bg-primary/10", text: "text-primary", gradient: "from-primary/8 to-primary/3" },
          };
          const c = colorMap[color];

          return (
            <section
              key={section.id}
              className="relative py-24 sm:py-28 overflow-hidden"
            >
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
                      <Card
                        key={item?.title}
                        className="rounded-2xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-0.5"
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
              </div>
            </section>
          );
        })}
    </>
  );
}
