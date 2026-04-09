import { getPageContent, getSections } from "@/lib/content";
import { getIcon } from "@/lib/icons";
import { Handshake, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";

export default async function PartnerPage() {
  const page = await getPageContent("partner");
  const hero = page?.hero;
  const sections = getSections(page);

  const textSections = sections.filter((s) => !s.items || s.items.length === 0);
  const itemSections = sections.filter((s) => s.items && s.items.length > 0);

  return (
    <>
      <PageHero
        badge={hero?.badge}
        badgeIcon={<Handshake className="h-4 w-4" />}
        badgeClassName="bg-primary/10 text-primary"
        headline={hero?.headline}
        subheadline={hero?.subheadline}
        blobs={
          <>
            <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-primary/6 blur-3xl" />
            <div className="absolute bottom-0 -left-32 h-80 w-80 blob-shape-2 bg-sage/8 blur-3xl" />
          </>
        }
      />

      {/* Text sections as left-aligned intro blocks */}
      {textSections.length > 0 && (
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {textSections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage/15">
                    <Handshake className="h-5 w-5 text-sage" />
                  </div>
                  <h2 className="text-3xl font-extrabold sm:text-4xl">{section.heading}</h2>
                </div>
                <p className="mt-4 text-muted-foreground leading-relaxed text-lg max-w-2xl">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Item sections as feature card grids */}
      {itemSections.map((section) => {
        const items = (section.items ?? []).filter((i): i is NonNullable<typeof i> => !!i);
        return (
          <section key={section.id} className="relative py-24 sm:py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
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
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/8 to-primary/3">
                          <ItemIcon className="h-6 w-6 text-primary" />
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

      {/* CTA Section */}
      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Card className="relative overflow-hidden rounded-[2.5rem] border-none ring-0 bg-gradient-to-br from-primary/10 via-primary/5 to-sage/10">
            <CardContent className="p-12 sm:p-16 text-center">
              <div className="absolute -top-10 -right-10 h-40 w-40 blob-shape-1 bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 blob-shape-2 bg-sage/10 blur-2xl" />
              <div className="relative">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-3xl font-extrabold sm:text-4xl">Interested in Partnering?</h2>
                <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                  We&apos;d love to hear from you. Reach out and let&apos;s explore how we can work together.
                </p>
                <Button asChild size="lg" className="mt-10 rounded-full px-10 py-6 text-base gap-2 shadow-gold">
                  <Link href="/contact">
                    Get in Touch <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
