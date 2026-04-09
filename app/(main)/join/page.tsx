import { getPageContent, getSections } from "@/lib/content";
import { getIcon } from "@/lib/icons";
import { Sparkles, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { JoinForm } from "@/components/join-form";

export default async function JoinPage() {
  const page = await getPageContent("join");
  const hero = page?.hero;
  const sections = getSections(page);

  const formSection = sections.find((s) => s.id === "form");
  const itemSections = sections.filter((s) => s.items && s.items.length > 0 && s.id !== "form");
  const textSections = sections.filter((s) => (!s.items || s.items.length === 0) && s.id !== "form");

  return (
    <>
      <PageHero
        badge={hero?.badge}
        badgeIcon={<Sparkles className="h-4 w-4" />}
        badgeClassName="mb-5 bg-primary/10 text-primary"
        headline={hero?.headline}
        subheadline={hero?.subheadline}
        centered
        blobs={
          <>
            <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-primary/6 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 blob-shape-2 bg-sage/8 blur-3xl" />
            <div className="absolute top-1/2 left-1/4 h-60 w-60 blob-shape-3 bg-terracotta/5 blur-3xl" />
          </>
        }
      />

      {/* Why Join - Feature cards */}
      {itemSections.map((section) => {
        const items = (section.items ?? []).filter((i): i is NonNullable<typeof i> => !!i);
        return (
          <section key={section.id} className="-mt-4 pb-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold sm:text-3xl">{section.heading}</h2>
                {section.body && (
                  <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{section.body}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => {
                  const ItemIcon = getIcon(item?.icon);
                  return (
                    <Card
                      key={item?.title}
                      className="rounded-2xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all"
                    >
                      <CardContent className="flex items-start gap-4 p-6">
                        <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/4">
                          <ItemIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold">{item?.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {item?.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Eligibility / text sections */}
      {textSections.map((section) => (
        <section key={section.id} className="pb-8">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <Card className="rounded-2xl border-none ring-0 bg-muted/50">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
                  <Info className="h-5 w-5 text-terracotta" />
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                    {section.heading}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{section.body}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ))}

      {/* Form */}
      <section className="pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 mt-8">
          <JoinForm
            formHeading={formSection?.heading}
            formDescription={formSection?.body}
            successHeading={formSection?.items?.[0]?.title}
            successMessage={formSection?.items?.[0]?.description}
          />
        </div>
      </section>
    </>
  );
}
