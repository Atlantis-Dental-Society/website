import { getPageContent, getSiteConfig } from "@/lib/tina";
import { Mail, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/page-hero";

export default async function ContactPage() {
  const page = await getPageContent("contact");
  const site = await getSiteConfig();
  const hero = page?.hero;

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
    </>
  );
}
