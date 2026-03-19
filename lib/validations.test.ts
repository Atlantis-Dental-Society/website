import { describe, it, expect } from "vitest";
import { eventSchema, insightSchema, joinSubmissionSchema } from "./validations";

// ─── Event Schema ────────────────────────────────────────────────────────────

describe("eventSchema", () => {
  const validEvent = {
    title: "Annual Gala",
    date: "2026-04-15",
    description: "A great event",
    endDate: "2026-04-16",
    time: "18:00",
    location: "Toronto",
    category: "Workshop",
    registrationUrl: "https://example.com",
    featured: true,
    published: true,
  };

  it("accepts a fully populated event", () => {
    const result = eventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it("requires title", () => {
    const result = eventSchema.safeParse({ ...validEvent, title: "" });
    expect(result.success).toBe(false);
  });

  it("requires date", () => {
    const result = eventSchema.safeParse({ ...validEvent, date: "" });
    expect(result.success).toBe(false);
  });

  it("accepts only required fields with empty optional fields", () => {
    const result = eventSchema.safeParse({
      title: "Test",
      date: "2026-03-25",
      description: "",
      endDate: "",
      time: "",
      location: "",
      category: "",
      registrationUrl: "",
      featured: false,
      published: true,
    });
    expect(result.success).toBe(true);
  });

  // ── Empty strings → undefined (critical for DB date columns) ──────────────

  it("transforms empty description to undefined", () => {
    const result = eventSchema.safeParse({ ...validEvent, description: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.description).toBeNull();
  });

  it("transforms empty endDate to undefined", () => {
    const result = eventSchema.safeParse({ ...validEvent, endDate: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.endDate).toBeNull();
  });

  it("transforms empty time to undefined", () => {
    const result = eventSchema.safeParse({ ...validEvent, time: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.time).toBeNull();
  });

  it("transforms empty location to undefined", () => {
    const result = eventSchema.safeParse({ ...validEvent, location: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.location).toBeNull();
  });

  it("transforms empty category to undefined", () => {
    const result = eventSchema.safeParse({ ...validEvent, category: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.category).toBeNull();
  });

  it("transforms empty registrationUrl to undefined", () => {
    const result = eventSchema.safeParse({ ...validEvent, registrationUrl: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.registrationUrl).toBeNull();
  });

  it("keeps non-empty optional strings", () => {
    const result = eventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe("A great event");
      expect(result.data.endDate).toBe("2026-04-16");
      expect(result.data.location).toBe("Toronto");
    }
  });

  // ── Registration URL validation ───────────────────────────────────────────

  it("rejects invalid registrationUrl", () => {
    const result = eventSchema.safeParse({ ...validEvent, registrationUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("accepts valid registrationUrl", () => {
    const result = eventSchema.safeParse({ ...validEvent, registrationUrl: "https://example.com/register" });
    expect(result.success).toBe(true);
  });
});

// ─── Insight Schema ──────────────────────────────────────────────────────────

describe("insightSchema", () => {
  const validInsight = {
    title: "My Post",
    slug: "my-post",
    excerpt: "Summary",
    body: "# Hello",
    author: "Ali",
    authorPosition: "President",
    category: "Student Life",
    coverImageUrl: "https://example.com/img.jpg",
    published: true,
    publishedDate: "2026-03-19",
  };

  it("accepts a fully populated insight", () => {
    const result = insightSchema.safeParse(validInsight);
    expect(result.success).toBe(true);
  });

  it("requires title", () => {
    const result = insightSchema.safeParse({ ...validInsight, title: "" });
    expect(result.success).toBe(false);
  });

  it("requires slug", () => {
    const result = insightSchema.safeParse({ ...validInsight, slug: "" });
    expect(result.success).toBe(false);
  });

  it("accepts only required fields with empty optional fields", () => {
    const result = insightSchema.safeParse({
      title: "Test",
      slug: "test",
      excerpt: "",
      body: "",
      author: "",
      authorPosition: "",
      category: "",
      coverImageUrl: "",
      published: true,
      publishedDate: "",
    });
    expect(result.success).toBe(true);
  });

  // ── Empty strings → undefined (critical for DB date columns) ──────────────

  it("transforms empty publishedDate to undefined", () => {
    const result = insightSchema.safeParse({ ...validInsight, publishedDate: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.publishedDate).toBeNull();
  });

  it("transforms empty excerpt to undefined", () => {
    const result = insightSchema.safeParse({ ...validInsight, excerpt: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.excerpt).toBeNull();
  });

  it("transforms empty body to undefined", () => {
    const result = insightSchema.safeParse({ ...validInsight, body: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.body).toBeNull();
  });

  it("transforms empty author to undefined", () => {
    const result = insightSchema.safeParse({ ...validInsight, author: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.author).toBeNull();
  });

  it("transforms empty coverImageUrl to undefined", () => {
    const result = insightSchema.safeParse({ ...validInsight, coverImageUrl: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.coverImageUrl).toBeNull();
  });

  it("keeps non-empty optional strings", () => {
    const result = insightSchema.safeParse(validInsight);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.publishedDate).toBe("2026-03-19");
      expect(result.data.author).toBe("Ali");
      expect(result.data.body).toBe("# Hello");
    }
  });
});

// ─── Join Submission Schema ──────────────────────────────────────────────────

describe("joinSubmissionSchema", () => {
  const validJoin = {
    name: "John Doe",
    email: "john@example.com",
    major: "Biology",
    year: "3rd Year",
    school: "York University",
    interestInDentistry: "Love teeth",
    whyDentistry: "Want to help people",
  };

  it("accepts a fully populated submission", () => {
    const result = joinSubmissionSchema.safeParse(validJoin);
    expect(result.success).toBe(true);
  });

  it("requires name", () => {
    const result = joinSubmissionSchema.safeParse({ ...validJoin, name: "" });
    expect(result.success).toBe(false);
  });

  it("requires valid email", () => {
    const result = joinSubmissionSchema.safeParse({ ...validJoin, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("requires email", () => {
    const result = joinSubmissionSchema.safeParse({ ...validJoin, email: "" });
    expect(result.success).toBe(false);
  });

  it("accepts only required fields with empty optional fields", () => {
    const result = joinSubmissionSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      major: "",
      year: "",
      school: "",
      interestInDentistry: "",
      whyDentistry: "",
    });
    expect(result.success).toBe(true);
  });

  it("transforms empty optional strings to undefined", () => {
    const result = joinSubmissionSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      major: "",
      year: "",
      school: "",
      interestInDentistry: "",
      whyDentistry: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.major).toBeNull();
      expect(result.data.year).toBeNull();
      expect(result.data.school).toBeNull();
      expect(result.data.interestInDentistry).toBeNull();
      expect(result.data.whyDentistry).toBeNull();
    }
  });

  it("keeps non-empty optional strings", () => {
    const result = joinSubmissionSchema.safeParse(validJoin);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.major).toBe("Biology");
      expect(result.data.school).toBe("York University");
    }
  });
});
