import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import crypto from "node:crypto";

// ---------------------------------------------------------------------------
// Schema (self-contained – no project lib imports)
// ---------------------------------------------------------------------------

const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
});

const insights = pgTable("insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
});

const photos = pgTable("photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  url: text("url").notNull(),
  key: text("key").notNull(),
  order: text("sort_order").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL env var");
  process.exit(1);
}

const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET ?? "ads-atlantis-media";

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
  console.error("Missing one or more AWS env vars (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION)");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function downloadRandomPhoto(): Promise<Buffer> {
  const res = await fetch("https://picsum.photos/800/600");
  if (!res.ok) {
    throw new Error(`Failed to download photo: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToS3(key: string, body: Buffer): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: "image/jpeg",
    }),
  );
  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

function randomPhotoCount(): number {
  return Math.random() < 0.5 ? 2 : 3;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seed() {
  console.log("Fetching events and insights from database...");

  const allEvents = await db.select().from(events);
  const allInsights = await db.select().from(insights);

  console.log(`Found ${allEvents.length} events and ${allInsights.length} insights`);

  // Seed event photos
  for (const event of allEvents) {
    const count = randomPhotoCount();
    console.log(`\nEvent: "${event.title}" - uploading ${count} photos`);

    for (let i = 0; i < count; i++) {
      const uuid = crypto.randomUUID();
      const key = `events/${event.id}/${uuid}.jpg`;

      console.log(`  Downloading photo ${i + 1}/${count}...`);
      const imageBuffer = await downloadRandomPhoto();

      console.log(`  Uploading to S3: ${key}`);
      const url = await uploadToS3(key, imageBuffer);

      await db.insert(photos).values({
        entityType: "events",
        entityId: event.id,
        url,
        key,
        order: String(i),
      });

      console.log(`  Saved photo record (order: ${i})`);
    }
  }

  // Seed insight photos
  for (const insight of allInsights) {
    const count = randomPhotoCount();
    console.log(`\nInsight: "${insight.title}" - uploading ${count} photos`);

    for (let i = 0; i < count; i++) {
      const uuid = crypto.randomUUID();
      const key = `insights/${insight.id}/${uuid}.jpg`;

      console.log(`  Downloading photo ${i + 1}/${count}...`);
      const imageBuffer = await downloadRandomPhoto();

      console.log(`  Uploading to S3: ${key}`);
      const url = await uploadToS3(key, imageBuffer);

      await db.insert(photos).values({
        entityType: "insights",
        entityId: insight.id,
        url,
        key,
        order: String(i),
      });

      console.log(`  Saved photo record (order: ${i})`);
    }
  }

  console.log(`\nDone! Seeded photos for ${allEvents.length} events and ${allInsights.length} insights.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
