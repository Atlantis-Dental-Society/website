import { db } from "@/lib/db";
import { siteConfig, pageContent, type SectionData } from "@/lib/schema";
import { eq } from "drizzle-orm";

export type Section = SectionData;

export async function getSiteConfig() {
  const [config] = await db.select().from(siteConfig).limit(1);
  return config ?? null;
}

export async function getPageContent(slug: string) {
  const [page] = await db.select().from(pageContent).where(eq(pageContent.slug, slug));
  return page ?? null;
}

export function getSections(page: Awaited<ReturnType<typeof getPageContent>>): Section[] {
  return ((page?.sections ?? []) as (Section | null)[]).filter(Boolean) as Section[];
}
