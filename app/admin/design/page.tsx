"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const FluidGlass = dynamic(() => import("@/components/FluidGlass"), { ssr: false });

const brandColors = [
  { name: "Gold (Primary)", var: "--primary", hex: "#D4AF37", tw: "bg-primary" },
  { name: "Sage (Secondary)", var: "--secondary", hex: "#7B916F", tw: "bg-secondary" },
  { name: "Terracotta (Accent)", var: "--accent", hex: "#C4856A", tw: "bg-accent" },
  { name: "Warm Cream", var: "--background", hex: "#FAF5ED", tw: "bg-background" },
  { name: "Dark Brown", var: "--foreground", hex: "#2D2419", tw: "bg-foreground" },
  { name: "Warm Beige", var: "--muted", hex: "#F0E8DA", tw: "bg-muted" },
];

const extendedColors = [
  { name: "Gold Light", hex: "#E8D48B", tw: "bg-gold-light" },
  { name: "Sage Light", hex: "#A3C4A0", tw: "bg-sage-light" },
  { name: "Terracotta Light", hex: "#D9A98E", tw: "bg-terracotta-light" },
  { name: "Warm Dark", hex: "#1A1612", tw: "bg-warm-dark" },
  { name: "Destructive", hex: "#C0392B", tw: "bg-destructive" },
  { name: "Border", hex: "#E4D9C8", tw: "bg-border" },
];

const darkModeColors = [
  { name: "Background", hex: "#1A1612" },
  { name: "Card", hex: "#252017" },
  { name: "Muted", hex: "#2E2820" },
  { name: "Muted FG", hex: "#B8A99A" },
  { name: "Destructive", hex: "#E74C3C" },
];

const avatarColors = [
  "#D4AF37", "#7B916F", "#C4856A", "#8B7355", "#6B8E9B",
  "#9B6B8E", "#6B9B7A", "#B07D4B", "#7A6B9B", "#9B7A6B",
];

const shadows = [
  { name: "shadow-warm-sm", value: "0 2px 12px rgba(45,36,25,0.06)", class: "shadow-warm-sm" },
  { name: "shadow-warm", value: "0 4px 24px rgba(45,36,25,0.08)", class: "shadow-warm" },
  { name: "shadow-warm-lg", value: "0 8px 40px rgba(45,36,25,0.10)", class: "shadow-warm-lg" },
  { name: "shadow-warm-xl", value: "0 16px 64px rgba(45,36,25,0.12)", class: "shadow-warm-xl" },
  { name: "shadow-gold", value: "0 4px 24px rgba(212,175,55,0.15)", class: "shadow-gold" },
];

const fontWeights = [
  { weight: 300, label: "Light" },
  { weight: 400, label: "Regular" },
  { weight: 500, label: "Medium" },
  { weight: 600, label: "Semibold" },
  { weight: 700, label: "Bold" },
  { weight: 800, label: "Extra Bold" },
];

const radiusScale = [
  { name: "sm", value: "0.9rem" },
  { name: "md", value: "1.2rem" },
  { name: "lg", value: "1.5rem" },
  { name: "xl", value: "2.1rem" },
  { name: "2xl", value: "2.7rem" },
  { name: "3xl", value: "3.3rem" },
];

const techStack = [
  { name: "Next.js 15", role: "Framework" },
  { name: "React 19", role: "UI Library" },
  { name: "TypeScript 5.9", role: "Language" },
  { name: "Tailwind CSS 4", role: "Styling" },
  { name: "shadcn/ui", role: "Component Library" },
  { name: "Radix UI", role: "Accessible Primitives" },
  { name: "Drizzle ORM", role: "Database" },
  { name: "Neon Postgres", role: "Database Provider" },
  { name: "Better Auth", role: "Authentication" },
  { name: "AWS S3 + CloudFront", role: "Media Storage & CDN" },
  { name: "AWS SES", role: "Email" },
  { name: "TinaCMS", role: "Content Management" },
  { name: "Vercel", role: "Hosting & CI/CD" },
  { name: "Lucide Icons", role: "Iconography" },
  { name: "Sonner", role: "Toast Notifications" },
  { name: "Nunito", role: "Font (Google Fonts)" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold">{children}</h2>
      <Separator className="mt-3 bg-gradient-to-r from-primary/40 via-border to-transparent" />
    </div>
  );
}

function ColorSwatch({ name, hex, large }: { name: string; hex: string; large?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${large ? "h-20 w-20" : "h-14 w-14"} rounded-2xl shadow-warm border border-border/30`}
        style={{ backgroundColor: hex }}
      />
      <div className="text-center">
        <p className="text-xs font-semibold leading-tight">{name}</p>
        <p className="text-[10px] text-muted-foreground font-mono">{hex}</p>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen">
      {/* FluidGlass Hero */}
      <div className="relative h-[420px] w-full overflow-hidden rounded-b-3xl">
        <FluidGlass mode="lens" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg sm:text-5xl tracking-tight">
            Design System
          </h1>
          <p className="mt-2 text-white/70 text-sm font-medium tracking-wide">
            Atlantis Dental Society
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">

        {/* Brand Identity */}
        <section>
          <SectionTitle>Brand Identity</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="rounded-2xl border-none ring-0 shadow-warm">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Atlantis Dental Society</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A student-led organization at York University helping future dental professionals
                  navigate the path to dental school. Everything pre-dental, all in one place.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-primary/10 text-primary">Pre-Dental</Badge>
                  <Badge className="rounded-full bg-secondary/10 text-secondary">York University</Badge>
                  <Badge className="rounded-full bg-accent/10 text-accent">Student-Led</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-none ring-0 shadow-warm">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Design Philosophy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Warm, organic, and sophisticated. The design language draws from natural
                  earthy tones — gold, sage green, and terracotta — with soft rounded shapes,
                  organic blob decorations, and warm shadows that create depth without harshness.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  Supports both light and dark modes with carefully tuned color palettes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Primary Colors */}
        <section>
          <SectionTitle>Brand Colors</SectionTitle>
          <Card className="rounded-2xl border-none ring-0 shadow-warm">
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-8 justify-center">
                {brandColors.map((c) => (
                  <ColorSwatch key={c.hex} name={c.name} hex={c.hex} large />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Extended Palette */}
        <section>
          <SectionTitle>Extended Palette</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="rounded-2xl border-none ring-0 shadow-warm">
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-4 text-muted-foreground uppercase tracking-wider">Light Variants & Utilities</h3>
                <div className="flex flex-wrap gap-6">
                  {extendedColors.map((c) => (
                    <ColorSwatch key={c.hex} name={c.name} hex={c.hex} />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-none ring-0 shadow-warm">
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-4 text-muted-foreground uppercase tracking-wider">Dark Mode</h3>
                <div className="flex flex-wrap gap-6">
                  {darkModeColors.map((c) => (
                    <ColorSwatch key={c.hex} name={c.name} hex={c.hex} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Avatar Colors */}
        <section>
          <SectionTitle>Avatar Palette</SectionTitle>
          <Card className="rounded-2xl border-none ring-0 shadow-warm">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                10 distinct colors assigned by name-hash for user avatar initials.
              </p>
              <div className="flex flex-wrap gap-3">
                {avatarColors.map((hex) => (
                  <div key={hex} className="flex flex-col items-center gap-1.5">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: hex }}
                    >
                      AB
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{hex}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Typography */}
        <section>
          <SectionTitle>Typography</SectionTitle>
          <Card className="rounded-2xl border-none ring-0 shadow-warm">
            <CardContent className="p-8">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-5xl font-extrabold tracking-tight">Nunito</span>
                <span className="text-muted-foreground text-sm">Google Fonts &middot; Latin subset</span>
              </div>
              <div className="space-y-3">
                {fontWeights.map((fw) => (
                  <div key={fw.weight} className="flex items-baseline gap-4">
                    <span className="w-20 text-xs text-muted-foreground font-mono shrink-0">{fw.weight}</span>
                    <span style={{ fontWeight: fw.weight }} className="text-xl">
                      The quick brown fox jumps over the lazy dog
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">{fw.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Shadows */}
        <section>
          <SectionTitle>Shadows</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shadows.map((s) => (
              <Card key={s.name} className={`rounded-2xl border-none ring-0 ${s.class}`}>
                <CardContent className="p-6 text-center">
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground font-mono mt-1 break-all">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <SectionTitle>Border Radius Scale</SectionTitle>
          <Card className="rounded-2xl border-none ring-0 shadow-warm">
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-6 items-end justify-center">
                {radiusScale.map((r) => (
                  <div key={r.name} className="flex flex-col items-center gap-2">
                    <div
                      className="h-16 w-16 bg-primary/15 border-2 border-primary/30"
                      style={{ borderRadius: r.value }}
                    />
                    <p className="text-xs font-semibold">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{r.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Blob Shapes */}
        <section>
          <SectionTitle>Organic Blob Shapes</SectionTitle>
          <Card className="rounded-2xl border-none ring-0 shadow-warm">
            <CardContent className="p-8">
              <p className="text-sm text-muted-foreground mb-6">
                Used as decorative background elements throughout the site for an organic feel.
              </p>
              <div className="flex flex-wrap gap-8 justify-center">
                {[
                  { name: "blob-shape-1", radius: "60% 40% 30% 70% / 60% 30% 70% 40%", color: "bg-primary/15" },
                  { name: "blob-shape-2", radius: "40% 60% 70% 30% / 40% 70% 30% 60%", color: "bg-sage/15" },
                  { name: "blob-shape-3", radius: "50% 50% 40% 60% / 35% 65% 35% 65%", color: "bg-terracotta/15" },
                ].map((blob) => (
                  <div key={blob.name} className="flex flex-col items-center gap-3">
                    <div
                      className={`h-28 w-28 ${blob.color}`}
                      style={{ borderRadius: blob.radius }}
                    />
                    <p className="text-xs font-semibold">{blob.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono max-w-[180px] text-center leading-tight">{blob.radius}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tech Stack */}
        <section>
          <SectionTitle>Technical Stack</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech) => (
              <Card key={tech.name} className="rounded-2xl border-none ring-0 shadow-warm hover:shadow-warm-lg transition-all hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <p className="font-bold text-sm">{tech.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tech.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Credits */}
        <section>
          <SectionTitle>Credits</SectionTitle>
          <Card className="rounded-2xl border-none ring-0 shadow-warm">
            <CardContent className="p-8">
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Built by</p>
                  <p className="font-bold text-lg">FZ1010</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Organization</p>
                  <p className="font-bold text-lg">Atlantis Dental Society</p>
                  <p className="text-sm text-muted-foreground">York University</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Domain</p>
                  <p className="font-bold text-lg">atlantisdentalsociety.ca</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
