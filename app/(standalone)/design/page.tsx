"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const brandColors = [
  { name: "Gold", role: "Primary", hex: "#D4AF37" },
  { name: "Sage", role: "Secondary", hex: "#7B916F" },
  { name: "Terracotta", role: "Accent", hex: "#C4856A" },
  { name: "Warm Cream", role: "Background", hex: "#FAF5ED" },
  { name: "Dark Brown", role: "Foreground", hex: "#2D2419" },
  { name: "Warm Beige", role: "Muted", hex: "#F0E8DA" },
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
  { name: "warm-sm", value: "0 2px 12px rgba(45,36,25,0.06)" },
  { name: "warm", value: "0 4px 24px rgba(45,36,25,0.08)" },
  { name: "warm-lg", value: "0 8px 40px rgba(45,36,25,0.10)" },
  { name: "warm-xl", value: "0 16px 64px rgba(45,36,25,0.12)" },
  { name: "gold", value: "0 4px 24px rgba(212,175,55,0.15)" },
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
  { name: "sm", value: "0.9rem", px: 14 },
  { name: "md", value: "1.2rem", px: 19 },
  { name: "lg", value: "1.5rem", px: 24 },
  { name: "xl", value: "2.1rem", px: 34 },
  { name: "2xl", value: "2.7rem", px: 43 },
  { name: "3xl", value: "3.3rem", px: 53 },
];

const blobs = [
  { name: "blob-shape-1", radius: "60% 40% 30% 70% / 60% 30% 70% 40%", color: "#D4AF37" },
  { name: "blob-shape-2", radius: "40% 60% 70% 30% / 40% 70% 30% 60%", color: "#7B916F" },
  { name: "blob-shape-3", radius: "50% 50% 40% 60% / 35% 65% 35% 65%", color: "#C4856A" },
];

const techStack = [
  { name: "Next.js 16", role: "Framework" },
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
  { name: "Vercel", role: "Hosting & CI/CD" },
  { name: "Lucide Icons", role: "Iconography" },
  { name: "Sonner", role: "Toast Notifications" },
  { name: "Nunito", role: "Font (Google Fonts)" },
];

export default function DesignSystemPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#1A1612]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    router.push("/login?callbackUrl=/design");
    return null;
  }

  return (
    <div className="min-h-svh bg-[#1A1612] text-[#FAF5ED] overflow-x-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(4px) rotate(-1deg); }
        }
        .fade-up { animation: fadeUp 0.8s ease-out both; }
        .fade-in { animation: fadeIn 1s ease-out both; }
        .scale-in { animation: scaleIn 0.6s ease-out both; }
        .slide-right { animation: slideRight 0.7s ease-out both; }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
        .stagger-7 { animation-delay: 0.7s; }
        .stagger-8 { animation-delay: 0.8s; }
        .stagger-9 { animation-delay: 0.9s; }
        .stagger-10 { animation-delay: 1.0s; }
        .shimmer-line {
          background: linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        .card {
          background: linear-gradient(135deg, rgba(37,32,23,0.8) 0%, rgba(26,22,18,0.9) 100%);
          border: 1px solid rgba(212,175,55,0.08);
          border-radius: 1.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          border-color: rgba(212,175,55,0.2);
          box-shadow: 0 8px 40px rgba(212,175,55,0.06), 0 0 0 1px rgba(212,175,55,0.05);
          transform: translateY(-2px);
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="relative h-svh flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#D4AF37]/[0.04] blur-[120px]" style={{ animation: "float 12s ease-in-out infinite" }} />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-[#7B916F]/[0.05] blur-[100px]" style={{ animation: "float 15s ease-in-out infinite reverse" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C4856A]/[0.03] blur-[150px]" />

        <div className="relative z-10 text-center max-w-3xl">
          <p className="fade-in text-sm font-semibold tracking-[0.3em] uppercase text-[#D4AF37]/70 mb-6">
            Atlantis Dental Society
          </p>
          <h1 className="fade-up stagger-1 text-6xl sm:text-8xl font-extrabold tracking-tight leading-[0.9]">
            Design
            <br />
            <span className="text-[#D4AF37]">System</span>
          </h1>
          <p className="fade-up stagger-3 mt-8 text-lg text-[#B8A99A] max-w-lg mx-auto leading-relaxed">
            Warm, organic, and sophisticated. A design language rooted in natural earthy tones.
          </p>
          <div className="fade-up stagger-5 mt-10 flex items-center justify-center gap-3">
            {["#D4AF37", "#7B916F", "#C4856A", "#FAF5ED", "#2D2419"].map((c, i) => (
              <div key={c} className={`scale-in stagger-${i + 5} h-3 w-3 rounded-full`} style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 fade-in stagger-8">
          <div className="w-5 h-8 rounded-full border-2 border-[#D4AF37]/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-[#D4AF37]/50 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pb-32 space-y-32">

        {/* Brand Colors */}
        <section>
          <SectionHeader title="Brand Colors" subtitle="The core palette driving every surface, accent, and interaction." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {brandColors.map((c, i) => (
              <div key={c.hex} className="card p-5 flex flex-col items-center gap-4 group" style={{ animationDelay: `${i * 0.08}s` }}>
                <div
                  className="w-full aspect-square rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="text-center">
                  <p className="font-bold text-sm text-[#FAF5ED]">{c.name}</p>
                  <p className="text-xs text-[#B8A99A] mt-0.5">{c.role}</p>
                  <p className="text-[11px] font-mono text-[#D4AF37]/50 mt-1">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Extended Palette */}
        <section>
          <SectionHeader title="Extended Palette" subtitle="Light variants, utilities, and dark mode overrides." />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card p-8">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37]/50 mb-6">Light Variants</h3>
              <div className="grid grid-cols-3 gap-4">
                {extendedColors.map((c) => (
                  <div key={c.hex} className="flex flex-col items-center gap-2">
                    <div className="w-full aspect-[4/3] rounded-lg" style={{ backgroundColor: c.hex }} />
                    <p className="text-xs font-semibold text-[#FAF5ED]/80">{c.name}</p>
                    <p className="text-[10px] font-mono text-[#B8A99A]/60">{c.hex}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-8">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37]/50 mb-6">Dark Mode</h3>
              <div className="grid grid-cols-3 gap-4">
                {darkModeColors.map((c) => (
                  <div key={c.hex} className="flex flex-col items-center gap-2">
                    <div className="w-full aspect-[4/3] rounded-lg border border-white/5" style={{ backgroundColor: c.hex }} />
                    <p className="text-xs font-semibold text-[#FAF5ED]/80">{c.name}</p>
                    <p className="text-[10px] font-mono text-[#B8A99A]/60">{c.hex}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Avatar Palette */}
        <section>
          <SectionHeader title="Avatar Palette" subtitle="10 hashed colors for user avatar initials." />
          <div className="card p-8">
            <div className="flex flex-wrap gap-5 justify-center">
              {avatarColors.map((hex, i) => (
                <div key={hex} className="flex flex-col items-center gap-2">
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-transform duration-300 hover:scale-110"
                    style={{ backgroundColor: hex }}
                  >
                    {String.fromCharCode(65 + i)}{String.fromCharCode(66 + i)}
                  </div>
                  <span className="text-[10px] font-mono text-[#B8A99A]/50">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <SectionHeader title="Typography" subtitle="Nunito — a warm, rounded sans-serif from Google Fonts." />
          <div className="card p-8 sm:p-10">
            <div className="flex items-baseline gap-4 mb-10 flex-wrap">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#FAF5ED]">Aa</span>
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#D4AF37]">Nunito</span>
            </div>
            <div className="space-y-4">
              {fontWeights.map((fw) => (
                <div key={fw.weight} className="flex items-baseline gap-5 group">
                  <span className="w-10 text-right text-xs font-mono text-[#D4AF37]/40 shrink-0">{fw.weight}</span>
                  <div className="h-px w-4 bg-[#D4AF37]/10 shrink-0 self-center" />
                  <span style={{ fontWeight: fw.weight }} className="text-xl text-[#FAF5ED]/80 truncate flex-1 transition-colors group-hover:text-[#FAF5ED]">
                    The quick brown fox jumps over the lazy dog
                  </span>
                  <span className="text-xs text-[#B8A99A]/40 shrink-0 hidden sm:block">{fw.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section>
          <SectionHeader title="Shadows" subtitle="Warm shadow utilities with subtle brown undertones." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shadows.map((s) => (
              <div key={s.name} className="card p-6 flex flex-col items-center gap-4">
                <div
                  className="w-full h-20 rounded-xl bg-[#FAF5ED]"
                  style={{ boxShadow: s.value }}
                />
                <div className="text-center">
                  <p className="font-bold text-sm text-[#FAF5ED]">{s.name}</p>
                  <p className="text-[10px] text-[#B8A99A]/50 font-mono mt-1 leading-relaxed">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <SectionHeader title="Border Radius" subtitle="A progressive scale from subtle to pill-shaped." />
          <div className="card p-8">
            <div className="flex flex-wrap gap-8 items-end justify-center">
              {radiusScale.map((r) => (
                <div key={r.name} className="flex flex-col items-center gap-3">
                  <div
                    className="h-20 w-20 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/15"
                    style={{ borderRadius: r.value }}
                  />
                  <p className="text-sm font-bold text-[#FAF5ED]/80">{r.name}</p>
                  <p className="text-[10px] text-[#B8A99A]/50 font-mono">{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blob Shapes */}
        <section>
          <SectionHeader title="Organic Blobs" subtitle="Decorative background shapes for warmth and movement." />
          <div className="card p-8">
            <div className="flex flex-wrap gap-12 justify-center items-center">
              {blobs.map((blob, i) => (
                <div key={blob.name} className="flex flex-col items-center gap-4">
                  <div
                    className="h-36 w-36"
                    style={{
                      borderRadius: blob.radius,
                      background: `linear-gradient(135deg, ${blob.color}30 0%, ${blob.color}10 100%)`,
                      border: `1px solid ${blob.color}20`,
                      animation: `float ${10 + i * 2}s ease-in-out infinite`,
                    }}
                  />
                  <p className="text-xs font-bold text-[#FAF5ED]/70">{blob.name}</p>
                  <p className="text-[10px] font-mono text-[#B8A99A]/40 max-w-[180px] text-center leading-tight">{blob.radius}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <SectionHeader title="Technical Stack" subtitle="The tools and frameworks powering this platform." />
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {techStack.map((tech) => (
              <div key={tech.name} className="card p-5 group">
                <p className="font-bold text-sm text-[#FAF5ED] group-hover:text-[#D4AF37] transition-colors">{tech.name}</p>
                <p className="text-xs text-[#B8A99A]/60 mt-1">{tech.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Credits */}
        <section>
          <div className="shimmer-line h-px w-full mb-16" />
          <div className="text-center space-y-4">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#D4AF37]/40">Built by</p>
            <p className="text-3xl font-extrabold text-[#FAF5ED]">FZ1010</p>
            <p className="text-sm text-[#B8A99A]/60">farhanzare1010@gmail.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#FAF5ED]">{title}</h2>
      <p className="mt-3 text-[#B8A99A]/70 text-lg">{subtitle}</p>
      <div className="shimmer-line h-px w-full mt-6" />
    </div>
  );
}
