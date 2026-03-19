import { z } from "zod/v4";

const optionalStr = z.string().optional().transform((v) => (v === "" ? null : v));

export const eventSchema = z.object({
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
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
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

export type EventInput = z.input<typeof eventSchema>;
export type InsightInput = z.input<typeof insightSchema>;
export type JoinSubmissionInput = z.input<typeof joinSubmissionSchema>;
