import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { events, insights } from "@/lib/schema";
import { eq } from "drizzle-orm";

const BASE = "https://atlantisdentalsociety.ca";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "", "/about", "/events", "/insights", "/services",
    "/resources", "/join", "/partner", "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  const allEvents = await db
    .select({ id: events.id, updatedAt: events.updatedAt })
    .from(events)
    .where(eq(events.published, true));

  const eventPages = allEvents.map((e) => ({
    url: `${BASE}/events/${e.id}`,
    lastModified: e.updatedAt ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const allInsights = await db
    .select({ slug: insights.slug, updatedAt: insights.updatedAt })
    .from(insights)
    .where(eq(insights.published, true));

  const insightPages = allInsights.map((i) => ({
    url: `${BASE}/insights/${i.slug}`,
    lastModified: i.updatedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...eventPages, ...insightPages];
}
