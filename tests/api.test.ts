import { describe, it, expect, afterAll } from "vitest";

const BASE = "http://localhost:3000";
const createdIds: { events: string[]; insights: string[]; photos: string[]; joins: string[] } = {
  events: [],
  insights: [],
  photos: [],
  joins: [],
};

// ─── Events API ──────────────────────────────────────────────────────────────

describe("POST /api/events", () => {
  it("creates an event with all fields", async () => {
    const res = await fetch(`${BASE}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Full Event",
        date: "2026-06-01",
        description: "A test event",
        endDate: "2026-06-02",
        time: "14:00",
        location: "Toronto",
        category: "Workshop",
        registrationUrl: "https://example.com/register",
        featured: true,
        published: true,
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBeDefined();
    expect(data.title).toBe("Full Event");
    expect(data.date).toBe("2026-06-01");
    expect(data.description).toBe("A test event");
    expect(data.endDate).toBe("2026-06-02");
    expect(data.time).toBe("14:00");
    expect(data.location).toBe("Toronto");
    expect(data.featured).toBe(true);
    createdIds.events.push(data.id);
  });

  it("creates an event with only required fields (empty optionals)", async () => {
    const res = await fetch(`${BASE}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Minimal Event",
        date: "2026-07-01",
        description: "",
        endDate: "",
        time: "",
        location: "",
        category: "",
        registrationUrl: "",
        featured: false,
        published: true,
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Minimal Event");
    expect(data.description).toBeNull();
    expect(data.endDate).toBeNull();
    expect(data.time).toBeNull();
    expect(data.location).toBeNull();
    expect(data.category).toBeNull();
    expect(data.registrationUrl).toBeNull();
    createdIds.events.push(data.id);
  });

  it("rejects event without title", async () => {
    const res = await fetch(`${BASE}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "", date: "2026-07-01" }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("rejects event without date", async () => {
    const res = await fetch(`${BASE}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "No Date", date: "" }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects event with invalid registrationUrl", async () => {
    const res = await fetch(`${BASE}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Bad URL",
        date: "2026-07-01",
        registrationUrl: "not-a-url",
      }),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/events", () => {
  it("returns a list of events", async () => {
    const res = await fetch(`${BASE}/api/events`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

describe("PUT /api/events/:id", () => {
  it("updates an existing event", async () => {
    const id = createdIds.events[0];
    if (!id) return;
    const res = await fetch(`${BASE}/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Updated Event",
        date: "2026-06-15",
        description: "",
        endDate: "",
        time: "",
        location: "",
        category: "",
        registrationUrl: "",
        featured: false,
        published: false,
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("Updated Event");
    expect(data.endDate).toBeNull();
  });

  it("returns 404 for non-existent event", async () => {
    const res = await fetch(`${BASE}/api/events/00000000-0000-0000-0000-000000000000`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "X", date: "2026-01-01" }),
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/events/:id", () => {
  it("returns 404 for non-existent event", async () => {
    const res = await fetch(`${BASE}/api/events/00000000-0000-0000-0000-000000000000`, { method: "DELETE" });
    expect(res.status).toBe(404);
  });
});

// ─── Insights API ────────────────────────────────────────────────────────────

describe("POST /api/insights", () => {
  it("creates an insight with all fields", async () => {
    const slug = `test-insight-${Date.now()}`;
    const res = await fetch(`${BASE}/api/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Full Insight",
        slug,
        excerpt: "Summary here",
        body: "# Hello World",
        author: "Test Author",
        authorPosition: "Editor",
        category: "Student Life",
        coverImageUrl: "https://example.com/img.jpg",
        published: true,
        publishedDate: "2026-03-19",
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBeDefined();
    expect(data.title).toBe("Full Insight");
    expect(data.slug).toBe(slug);
    expect(data.publishedDate).toBe("2026-03-19");
    createdIds.insights.push(data.id);
  });

  it("creates an insight with empty optional fields (null dates)", async () => {
    const slug = `minimal-insight-${Date.now()}`;
    const res = await fetch(`${BASE}/api/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Minimal Insight",
        slug,
        excerpt: "",
        body: "",
        author: "",
        authorPosition: "",
        category: "",
        coverImageUrl: "",
        published: true,
        publishedDate: "",
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Minimal Insight");
    expect(data.excerpt).toBeNull();
    expect(data.body).toBeNull();
    expect(data.author).toBeNull();
    expect(data.publishedDate).toBeNull();
    createdIds.insights.push(data.id);
  });

  it("rejects insight without title", async () => {
    const res = await fetch(`${BASE}/api/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "", slug: "no-title" }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects insight without slug", async () => {
    const res = await fetch(`${BASE}/api/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "No Slug", slug: "" }),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/insights", () => {
  it("returns a list of insights", async () => {
    const res = await fetch(`${BASE}/api/insights`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

describe("PUT /api/insights/:id", () => {
  it("updates an existing insight", async () => {
    const id = createdIds.insights[0];
    if (!id) return;
    const res = await fetch(`${BASE}/api/insights/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Updated Insight",
        slug: `updated-${Date.now()}`,
        excerpt: "",
        body: "",
        author: "",
        authorPosition: "",
        category: "",
        coverImageUrl: "",
        published: false,
        publishedDate: "",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("Updated Insight");
    expect(data.publishedDate).toBeNull();
  });

  it("returns 404 for non-existent insight", async () => {
    const res = await fetch(`${BASE}/api/insights/00000000-0000-0000-0000-000000000000`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "X", slug: "x" }),
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/insights/:id", () => {
  it("returns 404 for non-existent insight", async () => {
    const res = await fetch(`${BASE}/api/insights/00000000-0000-0000-0000-000000000000`, { method: "DELETE" });
    expect(res.status).toBe(404);
  });
});

// ─── Join API ────────────────────────────────────────────────────────────────

describe("POST /api/join", () => {
  it("creates a join submission with all fields", async () => {
    const res = await fetch(`${BASE}/api/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        major: "Biology",
        year: "3rd Year",
        school: "York University",
        interestInDentistry: "Love teeth",
        whyDentistry: "Want to help people",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("creates a join submission with only required fields", async () => {
    const res = await fetch(`${BASE}/api/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Minimal User",
        email: `minimal-${Date.now()}@example.com`,
        major: "",
        year: "",
        school: "",
        interestInDentistry: "",
        whyDentistry: "",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("rejects submission without name", async () => {
    const res = await fetch(`${BASE}/api/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", email: "a@b.com" }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects submission with invalid email", async () => {
    const res = await fetch(`${BASE}/api/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "John", email: "not-an-email" }),
    });
    expect(res.status).toBe(400);
  });
});

// ─── Upload API ─────────────────────────────────────────────────────────────

describe("POST /api/upload", () => {
  it("returns presigned URL for valid image upload", async () => {
    const eventId = createdIds.events[0];
    if (!eventId) return;
    const res = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: "test-photo.jpg",
        contentType: "image/jpeg",
        entityType: "events",
        entityId: eventId,
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.presignedUrl).toBeDefined();
    expect(data.publicUrl).toMatch(/cloudfront\.net|ads-atlantis-media/);
    expect(data.key).toContain("events/");
    expect(data.key).toContain(".jpg");
    // Key should use UUID filename, not original name
    expect(data.key).not.toContain("test-photo");
  });

  it("rejects non-image content type", async () => {
    const res = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: "doc.pdf",
        contentType: "application/pdf",
        entityType: "events",
        entityId: "some-id",
      }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("image");
  });

  it("rejects invalid entity type", async () => {
    const res = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: "photo.jpg",
        contentType: "image/jpeg",
        entityType: "users",
        entityId: "some-id",
      }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects missing fields", async () => {
    const res = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: "photo.jpg" }),
    });
    expect(res.status).toBe(400);
  });
});

// ─── Photos API ─────────────────────────────────────────────────────────────

describe("POST /api/photos", () => {
  it("creates a photo record", async () => {
    const eventId = createdIds.events[0];
    if (!eventId) return;
    const res = await fetch(`${BASE}/api/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityType: "events",
        entityId: eventId,
        url: "https://ads-atlantis-media.s3.us-east-1.amazonaws.com/events/test/photo.jpg",
        key: "events/test/photo.jpg",
        order: "0",
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBeDefined();
    expect(data.entityType).toBe("events");
    expect(data.url).toContain("photo.jpg");
    createdIds.photos.push(data.id);
  });

  it("rejects photo without required fields", async () => {
    const res = await fetch(`${BASE}/api/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType: "events" }),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/photos", () => {
  it("returns photos for a specific entity", async () => {
    const eventId = createdIds.events[0];
    if (!eventId) return;
    const res = await fetch(`${BASE}/api/photos?entityType=events&entityId=${eventId}`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("returns empty array for entity with no photos", async () => {
    const res = await fetch(`${BASE}/api/photos?entityType=events&entityId=00000000-0000-0000-0000-000000000000`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([]);
  });

  it("rejects missing query params", async () => {
    const res = await fetch(`${BASE}/api/photos`);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/photos/:id", () => {
  it("returns 404 for non-existent photo", async () => {
    const res = await fetch(`${BASE}/api/photos/00000000-0000-0000-0000-000000000000`, { method: "DELETE" });
    expect(res.status).toBe(404);
  });
});

// ─── Cleanup ─────────────────────────────────────────────────────────────────

afterAll(async () => {
  for (const id of createdIds.photos) {
    await fetch(`${BASE}/api/photos/${id}`, { method: "DELETE" });
  }
  for (const id of createdIds.events) {
    await fetch(`${BASE}/api/events/${id}`, { method: "DELETE" });
  }
  for (const id of createdIds.insights) {
    await fetch(`${BASE}/api/insights/${id}`, { method: "DELETE" });
  }
});
