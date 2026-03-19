import client from "@/tina/__generated__/client";
import type { PageSections } from "@/tina/__generated__/types";

export type Section = NonNullable<PageSections>;

export async function getPageContent(slug: string) {
  try {
    const result = await client.queries.page({ relativePath: `${slug}.json` });
    return result.data.page;
  } catch {
    return null;
  }
}

export function getSections(page: Awaited<ReturnType<typeof getPageContent>>): Section[] {
  return ((page?.sections ?? []) as (Section | null)[]).filter(Boolean) as Section[];
}

export async function getSiteConfig() {
  try {
    const result = await client.queries.siteConfig({ relativePath: "config.json" });
    return result.data.siteConfig;
  } catch {
    return null;
  }
}
