import { getPageContent, getSections } from "@/lib/content";
import { Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ComingSoon } from "@/components/coming-soon";

export default async function ServicesPage() {
  const page = await getPageContent("services");
  const hero = page?.hero;
  const sections = getSections(page);
  const firstSection = sections[0];

  return (
    <>
      <PageHero
        badge={hero?.badge}
        badgeClassName="bg-primary/10 text-primary"
        headline={hero?.headline}
        subheadline={hero?.subheadline}
        centered
        blobs={
          <>
            <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-1 bg-primary/6 blur-3xl" />
            <div className="absolute bottom-0 -left-32 h-80 w-80 blob-shape-2 bg-terracotta/5 blur-3xl" />
          </>
        }
      />

      <section className="-mt-8 pb-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ComingSoon
            icon={
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                <Clock className="h-8 w-8 text-primary" />
              </div>
            }
            title={firstSection?.heading || "Stay Tuned"}
            description={firstSection?.body || "We are working on building services that will support pre-dental students. Check back for updates."}
          />
        </div>
      </section>
    </>
  );
}
