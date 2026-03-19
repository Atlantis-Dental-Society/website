import { pgTable, serial, text, timestamp, boolean, date } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
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
});

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
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
});

export const joinSubmissions = pgTable("join_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  major: text("major"),
  year: text("year"),
  school: text("school"),
  interestInDentistry: text("interest_in_dentistry"),
  whyDentistry: text("why_dentistry"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});
