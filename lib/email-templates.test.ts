import { describe, it, expect } from "vitest";
import { buildNewEventEmail, buildNewInsightEmail, buildPasswordResetEmail } from "./email-templates";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockEvent = {
  id: "evt-1",
  title: "ADS Annual Gala",
  description: "A night of celebration and networking.",
  date: "2026-05-15",
  endDate: null,
  time: "6:00 PM",
  location: "Toronto Convention Centre",
  category: "Social",
  registrationUrl: null,
  featured: false,
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
} as const;

const mockInsight = {
  id: "ins-1",
  slug: "dat-study-tips",
  title: "Top 10 DAT Study Tips",
  excerpt: "Strategies to help you ace the DAT exam.",
  body: "# Study Tips\n\nHere are some tips...",
  author: "Ali",
  authorPosition: "President",
  category: "Academic",
  coverImageUrl: null,
  published: true,
  publishedDate: "2026-04-01",
  createdAt: new Date(),
  updatedAt: new Date(),
} as const;

// ─── Event Email ─────────────────────────────────────────────────────────────

describe("buildNewEventEmail", () => {
  it("returns subject, html, and text", () => {
    const result = buildNewEventEmail(mockEvent);
    expect(result).toHaveProperty("subject");
    expect(result).toHaveProperty("html");
    expect(result).toHaveProperty("text");
  });

  it("includes event title in subject", () => {
    const { subject } = buildNewEventEmail(mockEvent);
    expect(subject).toContain("ADS Annual Gala");
  });

  it("includes event title in html", () => {
    const { html } = buildNewEventEmail(mockEvent);
    expect(html).toContain("ADS Annual Gala");
  });

  it("includes date in html", () => {
    const { html } = buildNewEventEmail(mockEvent);
    expect(html).toContain("May 15, 2026");
  });

  it("includes location in html", () => {
    const { html } = buildNewEventEmail(mockEvent);
    expect(html).toContain("Toronto Convention Centre");
  });

  it("includes time in html", () => {
    const { html } = buildNewEventEmail(mockEvent);
    expect(html).toContain("6:00 PM");
  });

  it("includes description in html", () => {
    const { html } = buildNewEventEmail(mockEvent);
    expect(html).toContain("A night of celebration");
  });

  it("includes CTA link to events page", () => {
    const { html } = buildNewEventEmail(mockEvent);
    expect(html).toContain("/events");
    expect(html).toContain("View Event");
  });

  it("includes event link in text version", () => {
    const { text } = buildNewEventEmail(mockEvent);
    expect(text).toContain("/events");
  });

  it("handles event with no description", () => {
    const event = { ...mockEvent, description: null };
    const { html, text } = buildNewEventEmail(event);
    expect(html).toContain("ADS Annual Gala");
    expect(text).toContain("ADS Annual Gala");
  });

  it("handles event with no location or time", () => {
    const event = { ...mockEvent, location: null, time: null };
    const { html } = buildNewEventEmail(event);
    expect(html).toContain("ADS Annual Gala");
  });

  it("wraps content in ADS branded layout", () => {
    const { html } = buildNewEventEmail(mockEvent);
    expect(html).toContain("Atlantis Dental Society");
    expect(html).toContain("#D4AF37");
  });
});

// ─── Insight Email ───────────────────────────────────────────────────────────

describe("buildNewInsightEmail", () => {
  it("returns subject, html, and text", () => {
    const result = buildNewInsightEmail(mockInsight);
    expect(result).toHaveProperty("subject");
    expect(result).toHaveProperty("html");
    expect(result).toHaveProperty("text");
  });

  it("includes insight title in subject", () => {
    const { subject } = buildNewInsightEmail(mockInsight);
    expect(subject).toContain("Top 10 DAT Study Tips");
  });

  it("includes insight title in html", () => {
    const { html } = buildNewInsightEmail(mockInsight);
    expect(html).toContain("Top 10 DAT Study Tips");
  });

  it("includes author in html", () => {
    const { html } = buildNewInsightEmail(mockInsight);
    expect(html).toContain("Ali");
  });

  it("includes excerpt in html", () => {
    const { html } = buildNewInsightEmail(mockInsight);
    expect(html).toContain("Strategies to help you ace the DAT exam");
  });

  it("includes CTA link with slug", () => {
    const { html } = buildNewInsightEmail(mockInsight);
    expect(html).toContain("/insights/dat-study-tips");
    expect(html).toContain("Read More");
  });

  it("includes link in text version", () => {
    const { text } = buildNewInsightEmail(mockInsight);
    expect(text).toContain("/insights/dat-study-tips");
  });

  it("handles insight with no author", () => {
    const insight = { ...mockInsight, author: null };
    const { html } = buildNewInsightEmail(insight);
    expect(html).toContain("Top 10 DAT Study Tips");
    expect(html).not.toContain("By null");
  });

  it("handles insight with no excerpt", () => {
    const insight = { ...mockInsight, excerpt: null };
    const { html, text } = buildNewInsightEmail(insight);
    expect(html).toContain("Top 10 DAT Study Tips");
    expect(text).toContain("Top 10 DAT Study Tips");
  });

  it("wraps content in ADS branded layout", () => {
    const { html } = buildNewInsightEmail(mockInsight);
    expect(html).toContain("Atlantis Dental Society");
    expect(html).toContain("#D4AF37");
  });
});

// ─── Password Reset Email ────────────────────────────────────────────────────

describe("buildPasswordResetEmail", () => {
  const resetUrl = "https://example.com/reset-password?token=abc123";

  it("returns subject, html, and text", () => {
    const result = buildPasswordResetEmail(resetUrl, "Ali");
    expect(result).toHaveProperty("subject");
    expect(result).toHaveProperty("html");
    expect(result).toHaveProperty("text");
  });

  it("includes reset URL in html", () => {
    const { html } = buildPasswordResetEmail(resetUrl, "Ali");
    expect(html).toContain(resetUrl);
  });

  it("includes reset URL in text", () => {
    const { text } = buildPasswordResetEmail(resetUrl, "Ali");
    expect(text).toContain(resetUrl);
  });

  it("includes user name in greeting", () => {
    const { html } = buildPasswordResetEmail(resetUrl, "Ali");
    expect(html).toContain("Hi Ali,");
  });

  it("uses generic greeting when no name", () => {
    const { html } = buildPasswordResetEmail(resetUrl, null);
    expect(html).toContain("Hi,");
    expect(html).not.toContain("Hi null");
  });

  it("includes Reset Password CTA button", () => {
    const { html } = buildPasswordResetEmail(resetUrl, "Ali");
    expect(html).toContain("Reset Password");
  });

  it("includes expiry warning", () => {
    const { html, text } = buildPasswordResetEmail(resetUrl, "Ali");
    expect(html).toContain("1 hour");
    expect(text).toContain("1 hour");
  });

  it("includes subject with ADS branding", () => {
    const { subject } = buildPasswordResetEmail(resetUrl, "Ali");
    expect(subject).toContain("Atlantis Dental Society");
  });

  it("wraps content in ADS branded layout", () => {
    const { html } = buildPasswordResetEmail(resetUrl, "Ali");
    expect(html).toContain("Atlantis Dental Society");
    expect(html).toContain("#D4AF37");
  });
});
