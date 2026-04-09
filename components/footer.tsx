import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { siteConfig as siteConfigTable } from "@/lib/schema";

type SiteConfig = typeof siteConfigTable.$inferSelect;

export function Footer({ config }: { config?: SiteConfig | null }) {
  const email = config?.email || "atlantisdentalsociety@gmail.com";
  const instagramUrl = config?.instagramUrl || "https://instagram.com/atlantisdentalsociety";
  const instagramHandle = config?.instagramHandle || "@atlantisdentalsociety";
  const tagline = config?.tagline || "Everything pre-dental, all in one place.";
  const description = config?.description || "A student-led organization at York University helping pre-dental students navigate their path to dental school.";

  return (
    <footer className="relative bg-muted/40">
      {/* Organic wave divider */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="ADS" width={36} height={36} className="h-9 w-9" />
              <span className="text-lg font-bold text-foreground">ADS</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tagline}</p>
            <p className="mt-2 text-xs text-muted-foreground/70">
              {description}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="/insights" className="hover:text-primary transition-colors">Insights</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Get Involved</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/join" className="hover:text-primary transition-colors">Join</Link></li>
              <li><Link href="/partner" className="hover:text-primary transition-colors">Partner With Us</Link></li>
              <li><Link href="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-3.5 w-3.5 text-primary" />
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mt-12 bg-border/30" />

        <div className="flex flex-col items-center gap-3 pt-8">
          <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
            Made with <Heart className="h-3 w-3 text-terracotta fill-terracotta" /> by <Link href={'https://t.me/FarhanZare1010'}>FZ1010</Link>
          </div>
          <div className="text-center text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Atlantis Dental Society. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
