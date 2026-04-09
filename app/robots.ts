import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login", "/signup", "/forgot-password", "/reset-password"],
      },
    ],
    sitemap: "https://atlantisdentalsociety.ca/sitemap.xml",
  };
}
