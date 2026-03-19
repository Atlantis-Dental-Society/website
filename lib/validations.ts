import { z } from "zod/v4";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  endDate: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  registrationUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const insightSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  author: z.string().optional(),
  authorPosition: z.string().optional(),
  category: z.string().optional(),
  coverImageUrl: z.string().optional(),
  published: z.boolean().optional(),
  publishedDate: z.string().optional(),
});

export const joinSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email"),
  major: z.string().optional(),
  year: z.string().optional(),
  school: z.string().optional(),
  interestInDentistry: z.string().optional(),
  whyDentistry: z.string().optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
export type InsightInput = z.infer<typeof insightSchema>;
export type JoinSubmissionInput = z.infer<typeof joinSubmissionSchema>;
