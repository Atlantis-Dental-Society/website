import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { getSiteConfig } from "@/lib/content";

const SITE_URL = "https://atlantisdentalsociety.ca";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF5ED" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1612" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const siteName = config?.name || "Atlantis Dental Society";
  const description = config?.tagline || "Everything pre-dental, all in one place.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    icons: { icon: config?.favicon || "/logo.png" },
    openGraph: {
      type: "website",
      siteName,
      title: siteName,
      description,
      url: SITE_URL,
      images: [{ url: "/logo.png", width: 512, height: 512, alt: siteName }],
    },
    twitter: {
      card: "summary",
      title: siteName,
      description,
      images: ["/logo.png"],
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased font-sans", nunito.variable)}>
      <body>
        <ThemeProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: "1rem",
                fontFamily: "var(--font-sans)",
                border: "none",
                boxShadow: "0 4px 24px rgba(45, 36, 25, 0.12), 0 1px 4px rgba(45, 36, 25, 0.06)",
                backgroundColor: "var(--card)",
                color: "var(--card-foreground)",
              },
              classNames: {
                title: "!font-semibold",
                description: "!text-muted-foreground",
                success: "!bg-[var(--secondary)] !bg-opacity-100 !text-secondary-foreground [&_[data-icon]]:!text-secondary-foreground",
                error: "!bg-[var(--destructive)] !bg-opacity-100 !text-white [&_[data-icon]]:!text-white",
              },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
