import { getPageContent, getSections, getSiteConfig } from "@/lib/content";
import { getIcon } from "@/lib/icons";
import { Mail, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";

export default async function ContactPage() {
  const [page, site] = await Promise.all([getPageContent("contact"), getSiteConfig()]);
  const hero = page?.hero;
  const sections = getSections(page);

  return (
    <>
      <PageHero
        badge={hero?.badge}
        badgeIcon={<Mail className="h-4 w-4" />}
        badgeClassName="bg-primary/10 text-primary"
        headline={hero?.headline}
        subheadline={hero?.subheadline}
        centered
        blobs={
          <>
            <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-primary/6 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 blob-shape-2 bg-sage/8 blur-3xl" />
          </>
        }
      />

      <section className="-mt-8 pb-24">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <Card className="rounded-3xl border-none ring-0 shadow-warm">
            <CardContent className="flex items-center gap-4 p-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 shrink-0">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Email</h3>
                <a href={`mailto:${site?.email || "atlantisdentalsociety@gmail.com"}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {site?.email || "atlantisdentalsociety@gmail.com"}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none ring-0 shadow-warm">
            <CardContent className="flex items-center gap-4 p-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 shrink-0">
                <Instagram className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Instagram</h3>
                <a
                  href={site?.instagramUrl || "https://instagram.com/atlantisdentalsociety"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {site?.instagramHandle || "@atlantisdentalsociety"}
                </a>
              </div>
            </CardContent>
          </Card>
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
                <div className="max-w-2xl mb-10 mx-auto text-center">
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
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
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
