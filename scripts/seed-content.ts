import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { siteConfig, pageContent } from "../lib/schema";

const sql = neon(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  // Seed site config
  const configPath = join(process.cwd(), "content/site/config.json");
  const configData = JSON.parse(readFileSync(configPath, "utf-8"));

  const existing = await db.select().from(siteConfig).limit(1);
  if (existing.length === 0) {
    await db.insert(siteConfig).values({
      name: configData.name,
      tagline: configData.tagline,
      logo: configData.logo,
      favicon: configData.favicon,
      email: configData.email,
      instagramUrl: configData.instagramUrl,
      instagramHandle: configData.instagramHandle,
    });
    console.log("Inserted site config");
  } else {
    console.log("Site config already exists, skipping");
  }

  // Seed page content
  const pagesDir = join(process.cwd(), "content/pages");
  const files = readdirSync(pagesDir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const slug = file.replace(".json", "");
    const data = JSON.parse(readFileSync(join(pagesDir, file), "utf-8"));

    const existingPage = await db.select().from(pageContent).where(
      (await import("drizzle-orm")).eq(pageContent.slug, slug)
    );

    if (existingPage.length === 0) {
      await db.insert(pageContent).values({
        slug,
        title: data.title || slug,
        description: data.description || null,
        hero: data.hero || null,
        sections: data.sections || [],
      });
      console.log(`Inserted page: ${slug}`);
    } else {
      console.log(`Page ${slug} already exists, skipping`);
    }
  }

  console.log("Seed complete");
}

seed().catch(console.error);
