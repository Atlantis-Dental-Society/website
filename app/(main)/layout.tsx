import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSiteConfig } from "@/lib/content";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();

  return (
    <div className="flex min-h-svh flex-col">
      <Header logo={config?.logo ?? undefined} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
