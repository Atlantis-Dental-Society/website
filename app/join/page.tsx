import { getPageContent, getSections } from "@/lib/tina";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";
import { JoinForm } from "@/components/join-form";

export default async function JoinPage() {
  const page = await getPageContent("join");
  const hero = page?.hero;
  const sections = getSections(page);

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

      <section className="-mt-8 pb-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {sections.map((section) => (
            <Card key={section.id} className="mx-auto max-w-2xl rounded-2xl border-none ring-0 bg-muted/50">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{section.heading}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{section.body}</p>
              </CardContent>
            </Card>
          ))}

          <div className="mx-auto max-w-2xl mt-12">
            <JoinForm />
          </div>
        </div>
      </section>
    </>
  );
}
