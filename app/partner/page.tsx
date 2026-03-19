import { getPageContent, getSections } from "@/lib/tina";
import { Handshake, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";

export default async function PartnerPage() {
  const page = await getPageContent("partner");
  const hero = page?.hero;
  const sections = getSections(page);

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

      <section className="-mt-8 pb-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {sections.map((section) => (
            <div key={section.id} className="mb-10 max-w-3xl">
              <h2 className="text-2xl font-extrabold">{section.heading}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}

          <Button asChild size="lg" className="rounded-full px-8 py-6 text-base gap-2 shadow-gold">
            <Link href="/contact">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
