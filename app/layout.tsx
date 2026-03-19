import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-sans", weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata = {
  title: "Atlantis Dental Society",
  description: "Everything pre-dental, all in one place. A student-led organization at York University helping future dental professionals navigate the path to dental school.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased font-sans", nunito.variable)}>
      <body>
        <ThemeProvider>
          <div className="flex min-h-svh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
