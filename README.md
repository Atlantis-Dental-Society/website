# Atlantis Dental Society

A comprehensive platform for pre-dental students, built with Next.js 16 and deployed on Vercel.

**Live:** [atlantisdentalsociety.ca](https://atlantisdentalsociety.ca)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | shadcn/ui (Radix Nova), Tailwind CSS v4 |
| Database | PostgreSQL (Neon) via Drizzle ORM |
| Auth | Better Auth (email/password + password reset) |
| File Storage | AWS S3 + CloudFront CDN |
| Email | AWS SES (transactional notifications) |
| Icons | Lucide React |
| Hosting | Vercel |

## Features

### Public Pages
- **Home** - Hero, sections, upcoming events teaser
- **About** - Mission, vision, and values
- **Events** - Upcoming and past events with photo galleries
- **Insights** - Blog/articles with cover images and categories
- **Services** / **Resources** - Coming soon pages
- **Join** - Membership application form
- **Partner** - Partnership opportunities
- **Contact** - Contact information

### Admin Dashboard (`/admin`)
- **Events** - Create, edit, publish/draft, delete events with photo uploads
- **Insights** - Create, edit, publish/draft, delete articles with photo uploads
- **Members** - View join applications, manage registered users, toggle admin roles
- **Pages** - Edit page content (hero text, sections, items) for all 9 public pages
- **Settings** - Site name, tagline, logo, favicon, email, Instagram links
- **Design System** (`/design`) - Visual reference for colors, typography, shadows, and brand tokens

### Infrastructure
- Server-side auth checks on all mutating API routes
- S3 presigned URL uploads with MIME type validation
- Email notifications when events/insights are published
- Security headers (X-Frame-Options, CSP, Referrer-Policy)
- Dynamic sitemap and robots.txt
- Open Graph and Twitter card metadata

## Project Structure

```
app/
  (main)/              # Pages with header/footer layout
    admin/             # Admin dashboard, events, insights, members, pages, settings
    api/               # API routes (events, insights, photos, upload, join, admin)
    page.tsx           # Homepage
    about/ events/ insights/ join/ partner/ contact/ services/ resources/
  (standalone)/        # Pages without header/footer
    design/            # Design system showcase
  layout.tsx           # Root layout (fonts, metadata, theme)
  sitemap.ts           # Dynamic sitemap
  robots.ts            # Crawler directives
components/
  ui/                  # shadcn/ui components
  admin/               # Admin form components (event-form, insight-form, page-form, photo-uploader)
  header.tsx footer.tsx page-hero.tsx event-card.tsx insight-card.tsx
lib/
  auth.ts              # Better Auth config
  content.ts           # Page content + site config queries
  db.ts                # Database connection
  schema.ts            # Drizzle table definitions
  validations.ts       # Zod schemas
  email-templates.ts   # HTML email templates
  email-notifications.ts
  s3.ts                # S3 presigned URLs
  ses.ts               # AWS SES client
  require-admin.ts     # Auth middleware for API routes
  icons.ts             # Icon mapping
proxy.ts               # Next.js 16 middleware (auth protection)
```

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm 10+

### Setup

1. Clone the repo
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in `.env.local` with your credentials (see `.env.example` for required vars)
4. Install dependencies:
   ```bash
   pnpm install
   ```
5. Push the database schema:
   ```bash
   pnpm db:push
   ```
6. Seed page content (first time only):
   ```bash
   npx tsx scripts/seed-content.ts
   ```
7. Start the dev server:
   ```bash
   pnpm dev
   ```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm test` | Run Vitest tests |
| `pnpm db:generate` | Generate Drizzle migration |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio |

## Design System

The project uses a warm, organic design language:

- **Brand Colors:** Gold (#D4AF37), Sage (#7B916F), Terracotta (#C4856A)
- **Background:** Warm Cream (#FAF5ED light / #1A1612 dark)
- **Font:** Nunito (variable weight)
- **Radius:** 1.5rem base with organic blob shapes
- **Shadows:** Warm brown-tinted shadows with dark mode variants

View the full design system at `/design` (requires authentication).

## Environment Variables

See `.env.example` for all required variables:
- **Database:** `DATABASE_URL`, `DATABASE_URL_UNPOOLED`
- **AWS S3:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_CLOUDFRONT_DOMAIN`
- **AWS SES:** `SES_FROM_EMAIL`
- **Auth:** `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_TRUSTED_ORIGINS`
