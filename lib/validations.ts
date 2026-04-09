import { z } from "zod/v4";

const optionalStr = z.string().optional().transform((v) => (v === "" ? null : v));

export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: optionalStr,
  date: z.string().min(1, "Date is required"),
  endDate: optionalStr,
  time: optionalStr,
  location: optionalStr,
  category: optionalStr,
  registrationUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const insightSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: optionalStr,
  body: optionalStr,
  author: optionalStr,
  authorPosition: optionalStr,
  category: optionalStr,
  coverImageUrl: optionalStr,
  published: z.boolean().optional(),
  publishedDate: optionalStr,
});

export const joinSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email"),
  major: optionalStr,
  year: optionalStr,
  school: optionalStr,
  interestInDentistry: optionalStr,
  whyDentistry: optionalStr,
});

export const siteConfigSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  tagline: optionalStr,
  description: optionalStr,
  logo: optionalStr,
  favicon: optionalStr,
  email: z.string().email("Invalid email").optional().or(z.literal("")).transform((v) => (v === "" ? null : v)),
  instagramUrl: z.string().url("Invalid URL").optional().or(z.literal("")).transform((v) => (v === "" ? null : v)),
  instagramHandle: optionalStr,
});

const sectionItemSchema = z.object({
  title: optionalStr,
  description: optionalStr,
  icon: optionalStr,
});

const sectionSchema = z.object({
  id: optionalStr,
  heading: optionalStr,
  body: optionalStr,
  items: z.array(sectionItemSchema).optional().default([]),
});

const heroSchema = z.object({
  badge: optionalStr,
  headline: optionalStr,
  subheadline: optionalStr,
  ctaPrimary: optionalStr,
  ctaPrimaryLink: optionalStr,
  ctaSecondary: optionalStr,
  ctaSecondaryLink: optionalStr,
});

export const pageContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: optionalStr,
  hero: heroSchema.optional(),
  sections: z.array(sectionSchema).optional().default([]),
});

export type EventInput = z.input<typeof eventSchema>;
export type InsightInput = z.input<typeof insightSchema>;
export type JoinSubmissionInput = z.input<typeof joinSubmissionSchema>;
export type SiteConfigInput = z.input<typeof siteConfigSchema>;
export type PageContentInput = z.input<typeof pageContentSchema>;
