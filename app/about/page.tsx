import { getPageContent, getSections } from "@/lib/tina";
import { PageHero } from "@/components/page-hero";

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

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {sections.map((section) => (
              <div key={section.id}>
                <h2 className="text-3xl font-extrabold">{section.heading}</h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
