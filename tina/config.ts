import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
    },
  },
  schema: {
    collections: [
      {
        name: "siteConfig",
        label: "Site Config",
        path: "content/site",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: "string", name: "name", label: "Site Name", required: true },
          { type: "string", name: "tagline", label: "Tagline" },
          { type: "string", name: "email", label: "Email" },
          { type: "string", name: "instagramUrl", label: "Instagram URL" },
          { type: "string", name: "instagramHandle", label: "Instagram Handle" },
        ],
      },
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Title", required: true },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              { type: "string", name: "badge", label: "Badge Text" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "subheadline", label: "Sub-headline", ui: { component: "textarea" } },
              { type: "string", name: "ctaPrimary", label: "Primary CTA Text" },
              { type: "string", name: "ctaPrimaryLink", label: "Primary CTA Link" },
              { type: "string", name: "ctaSecondary", label: "Secondary CTA Text" },
              { type: "string", name: "ctaSecondaryLink", label: "Secondary CTA Link" },
            ],
          },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            fields: [
              { type: "string", name: "id", label: "Section ID" },
              { type: "string", name: "heading", label: "Heading" },
              { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
              {
                type: "object",
                name: "items",
                label: "Items",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "icon", label: "Icon" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
