import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";
import { getSiteConfig } from "@/lib/tina";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-sans", weight: ["300", "400", "500", "600", "700", "800"] });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return {
    title: config?.name || "Atlantis Dental Society",
    description: config?.tagline || "Everything pre-dental, all in one place.",
    icons: { icon: config?.favicon || "/logo.png" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();

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
          <div className="flex min-h-svh flex-col">
            <Header logo={config?.logo ?? undefined} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
