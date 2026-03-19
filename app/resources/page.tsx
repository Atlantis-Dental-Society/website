import { getPageContent } from "@/lib/tina";
import { BookOpen, FolderOpen } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ComingSoon } from "@/components/coming-soon";

export default async function ResourcesPage() {
  const page = await getPageContent("resources");
  const hero = page?.hero;

  return (
    <>
      <PageHero
        badge={hero?.badge}
        badgeIcon={<BookOpen className="h-4 w-4" />}
        badgeClassName="bg-sage/10 text-sage"
        headline={hero?.headline}
        subheadline={hero?.subheadline}
        blobs={
          <>
            <div className="absolute -top-32 -right-32 h-96 w-96 blob-shape-2 bg-primary/6 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 blob-shape-1 bg-sage/8 blur-3xl" />
          </>
        }
      />

      <section className="-mt-8 pb-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ComingSoon
            icon={
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage/10 mx-auto">
                <FolderOpen className="h-8 w-8 text-sage" />
              </div>
            }
            title="Resources Coming Soon"
            description="We are building out this section with helpful documents, guides, tools, and materials. Check back soon."
          />
        </div>
      </section>
    </>
  );
}
