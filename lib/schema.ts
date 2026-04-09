import { pgTable, uuid, text, timestamp, boolean, date, index, integer, jsonb } from "drizzle-orm/pg-core";

export { user, session, account, verification, userRelations, sessionRelations, accountRelations } from "./auth-schema";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  endDate: date("end_date"),
  time: text("time"),
  location: text("location"),
  category: text("category"),
  registrationUrl: text("registration_url"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("events_published_date_idx").on(table.published, table.date),
  index("events_featured_idx").on(table.featured),
]);

export const insights = pgTable("insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  body: text("body"),
  author: text("author"),
  authorPosition: text("author_position"),
  category: text("category"),
  coverImageUrl: text("cover_image_url"),
  published: boolean("published").default(true),
  publishedDate: date("published_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("insights_published_date_idx").on(table.published, table.publishedDate),
]);

export const photos = pgTable("photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  url: text("url").notNull(),
  key: text("key").notNull(),
  order: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("photos_entity_idx").on(table.entityType, table.entityId),
]);

export const siteConfig = pgTable("site_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  logo: text("logo"),
  favicon: text("favicon"),
  email: text("email"),
  instagramUrl: text("instagram_url"),
  instagramHandle: text("instagram_handle"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type HeroData = {
  badge?: string | null;
  headline?: string | null;
  subheadline?: string | null;
  ctaPrimary?: string | null;
  ctaPrimaryLink?: string | null;
  ctaSecondary?: string | null;
  ctaSecondaryLink?: string | null;
};

export type SectionItem = {
  title?: string | null;
  description?: string | null;
  icon?: string | null;
};

export type SectionData = {
  id?: string | null;
  heading?: string | null;
  body?: string | null;
  items?: SectionItem[];
};

export const pageContent = pgTable("page_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  hero: jsonb("hero").$type<HeroData>(),
  sections: jsonb("sections").$type<SectionData[]>().default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const joinSubmissions = pgTable("join_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  major: text("major"),
  year: text("year"),
  school: text("school"),
  interestInDentistry: text("interest_in_dentistry"),
  whyDentistry: text("why_dentistry"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});
