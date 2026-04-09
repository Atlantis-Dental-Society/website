"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const FluidGlass = dynamic(() => import("@/components/FluidGlass"), { ssr: false });

const brandColors = [
  { name: "Gold (Primary)", hex: "#D4AF37" },
  { name: "Sage (Secondary)", hex: "#7B916F" },
  { name: "Terracotta (Accent)", hex: "#C4856A" },
  { name: "Warm Cream", hex: "#FAF5ED" },
  { name: "Dark Brown", hex: "#2D2419" },
  { name: "Warm Beige", hex: "#F0E8DA" },
];

const extendedColors = [
  { name: "Gold Light", hex: "#E8D48B" },
  { name: "Sage Light", hex: "#A3C4A0" },
  { name: "Terracotta Light", hex: "#D9A98E" },
  { name: "Warm Dark", hex: "#1A1612" },
  { name: "Destructive", hex: "#C0392B" },
  { name: "Border", hex: "#E4D9C8" },
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
  { name: "shadow-warm-sm", value: "0 2px 12px rgba(45,36,25,0.06)" },
  { name: "shadow-warm", value: "0 4px 24px rgba(45,36,25,0.08)" },
  { name: "shadow-warm-lg", value: "0 8px 40px rgba(45,36,25,0.10)" },
  { name: "shadow-warm-xl", value: "0 16px 64px rgba(45,36,25,0.12)" },
  { name: "shadow-gold", value: "0 4px 24px rgba(212,175,55,0.15)" },
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

const glass = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]";
const glassInner = "p-6 sm:p-8";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold text-white drop-shadow-md">{children}</h2>
      <Separator className="mt-3 bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
    </div>
  );
}

function ColorSwatch({ name, hex, large }: { name: string; hex: string; large?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${large ? "h-20 w-20" : "h-14 w-14"} rounded-2xl border border-white/20 shadow-lg`}
        style={{ backgroundColor: hex }}
      />
      <div className="text-center">
        <p className="text-xs font-semibold leading-tight text-white/90">{name}</p>
        <p className="text-[10px] text-white/50 font-mono">{hex}</p>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#0f0a1e]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    router.push("/login?callbackUrl=/design");
    return null;
  }

  return (
    <div className="h-svh w-full">
      <FluidGlass mode="lens" pages={8}>
        <div className="mx-auto max-w-5xl px-4 pt-[110vh] pb-20 sm:px-6 lg:px-8 space-y-14">

          {/* Brand Identity */}
          <section>
            <SectionTitle>Brand Identity</SectionTitle>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className={glass}>
                <div className={glassInner}>
                  <h3 className="font-bold text-lg mb-2 text-white">Atlantis Dental Society</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    A student-led organization at York University helping future dental professionals
                    navigate the path to dental school. Everything pre-dental, all in one place.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30">Pre-Dental</Badge>
                    <Badge className="rounded-full bg-[#7B916F]/20 text-[#7B916F] border-[#7B916F]/30">York University</Badge>
                    <Badge className="rounded-full bg-[#C4856A]/20 text-[#C4856A] border-[#C4856A]/30">Student-Led</Badge>
                  </div>
                </div>
              </div>
              <div className={glass}>
                <div className={glassInner}>
                  <h3 className="font-bold text-lg mb-2 text-white">Design Philosophy</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Warm, organic, and sophisticated. The design language draws from natural
                    earthy tones — gold, sage green, and terracotta — with soft rounded shapes,
                    organic blob decorations, and warm shadows that create depth without harshness.
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed mt-2">
                    Supports both light and dark modes with carefully tuned color palettes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Brand Colors */}
          <section>
            <SectionTitle>Brand Colors</SectionTitle>
            <div className={glass}>
              <div className={`${glassInner} flex flex-wrap gap-8 justify-center`}>
                {brandColors.map((c) => (
                  <ColorSwatch key={c.hex} name={c.name} hex={c.hex} large />
                ))}
              </div>
            </div>
          </section>

          {/* Extended Palette */}
          <section>
            <SectionTitle>Extended Palette</SectionTitle>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className={glass}>
                <div className={glassInner}>
                  <h3 className="font-bold text-sm mb-4 text-white/50 uppercase tracking-wider">Light Variants & Utilities</h3>
                  <div className="flex flex-wrap gap-6">
                    {extendedColors.map((c) => (
                      <ColorSwatch key={c.hex} name={c.name} hex={c.hex} />
                    ))}
                  </div>
                </div>
              </div>
              <div className={glass}>
                <div className={glassInner}>
                  <h3 className="font-bold text-sm mb-4 text-white/50 uppercase tracking-wider">Dark Mode</h3>
                  <div className="flex flex-wrap gap-6">
                    {darkModeColors.map((c) => (
                      <ColorSwatch key={c.hex} name={c.name} hex={c.hex} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Avatar Colors */}
          <section>
            <SectionTitle>Avatar Palette</SectionTitle>
            <div className={glass}>
              <div className={glassInner}>
                <p className="text-sm text-white/50 mb-4">
                  10 distinct colors assigned by name-hash for user avatar initials.
                </p>
                <div className="flex flex-wrap gap-4">
                  {avatarColors.map((hex) => (
                    <div key={hex} className="flex flex-col items-center gap-1.5">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                        style={{ backgroundColor: hex }}
                      >
                        AB
                      </div>
                      <span className="text-[10px] font-mono text-white/40">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <SectionTitle>Typography</SectionTitle>
            <div className={glass}>
              <div className={glassInner}>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-5xl font-extrabold tracking-tight text-white">Nunito</span>
                  <span className="text-white/40 text-sm">Google Fonts &middot; Latin subset</span>
                </div>
                <div className="space-y-3">
                  {fontWeights.map((fw) => (
                    <div key={fw.weight} className="flex items-baseline gap-4">
                      <span className="w-16 text-xs text-white/40 font-mono shrink-0">{fw.weight}</span>
                      <span style={{ fontWeight: fw.weight }} className="text-lg text-white/80 truncate">
                        The quick brown fox jumps over the lazy dog
                      </span>
                      <span className="text-xs text-white/40 shrink-0 hidden sm:block">{fw.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Shadows */}
          <section>
            <SectionTitle>Shadows</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shadows.map((s) => (
                <div key={s.name} className={glass}>
                  <div className="p-5 text-center">
                    <p className="font-bold text-sm text-white/90">{s.name}</p>
                    <p className="text-[11px] text-white/40 font-mono mt-1 break-all">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Border Radius */}
          <section>
            <SectionTitle>Border Radius Scale</SectionTitle>
            <div className={glass}>
              <div className={`${glassInner} flex flex-wrap gap-6 items-end justify-center`}>
                {radiusScale.map((r) => (
                  <div key={r.name} className="flex flex-col items-center gap-2">
                    <div
                      className="h-16 w-16 bg-white/10 border-2 border-white/20"
                      style={{ borderRadius: r.value }}
                    />
                    <p className="text-xs font-semibold text-white/80">{r.name}</p>
                    <p className="text-[10px] text-white/40 font-mono">{r.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Blob Shapes */}
          <section>
            <SectionTitle>Organic Blob Shapes</SectionTitle>
            <div className={glass}>
              <div className={glassInner}>
                <p className="text-sm text-white/50 mb-6">
                  Decorative background elements used throughout the site for an organic feel.
                </p>
                <div className="flex flex-wrap gap-8 justify-center">
                  {[
                    { name: "blob-shape-1", radius: "60% 40% 30% 70% / 60% 30% 70% 40%", color: "#D4AF37" },
                    { name: "blob-shape-2", radius: "40% 60% 70% 30% / 40% 70% 30% 60%", color: "#7B916F" },
                    { name: "blob-shape-3", radius: "50% 50% 40% 60% / 35% 65% 35% 65%", color: "#C4856A" },
                  ].map((blob) => (
                    <div key={blob.name} className="flex flex-col items-center gap-3">
                      <div
                        className="h-28 w-28"
                        style={{ borderRadius: blob.radius, backgroundColor: `${blob.color}30` }}
                      />
                      <p className="text-xs font-semibold text-white/80">{blob.name}</p>
                      <p className="text-[10px] text-white/40 font-mono max-w-[180px] text-center leading-tight">{blob.radius}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <SectionTitle>Technical Stack</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {techStack.map((tech) => (
                <div key={tech.name} className={`${glass} transition-all hover:bg-white/10 hover:-translate-y-0.5`}>
                  <div className="p-4">
                    <p className="font-bold text-sm text-white/90">{tech.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{tech.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Credits */}
          <section>
            <SectionTitle>Credits</SectionTitle>
            <div className={glass}>
              <div className={glassInner}>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Built by</p>
                    <p className="font-bold text-lg text-white">FZ1010</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Organization</p>
                    <p className="font-bold text-lg text-white">Atlantis Dental Society</p>
                    <p className="text-sm text-white/50">York University</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1">Domain</p>
                    <p className="font-bold text-lg text-white">atlantisdentalsociety.ca</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </FluidGlass>
    </div>
  );
}
