import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
const mockSendEmail = vi.fn().mockResolvedValue(undefined);
vi.mock("./ses", () => ({ sendEmail: (...args: unknown[]) => mockSendEmail(...args) }));

vi.mock("./db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([
      { email: "alice@example.com", name: "Alice" },
      { email: "bob@example.com", name: "Bob" },
    ]),
  },
}));

vi.mock("./auth-schema", () => ({
  user: { emailNotifications: "email_notifications", role: "role" },
}));

import { notifyNewEvent, notifyNewInsight } from "./email-notifications";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockEvent = {
  id: "evt-1",
  title: "Spring Workshop",
  description: "Learn about dental materials.",
  date: "2026-05-20",
  endDate: null,
  time: "2:00 PM",
  location: "Room 101",
  category: "Workshop",
  registrationUrl: null,
  featured: false,
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
} as const;

const mockInsight = {
  id: "ins-1",
  slug: "interview-prep",
  title: "Interview Prep Guide",
  excerpt: "How to prepare for dental school interviews.",
  body: "# Tips\n\nBe yourself.",
  author: "Ali",
  authorPosition: "President",
  category: "Admissions",
  coverImageUrl: null,
  published: true,
  publishedDate: "2026-04-08",
  createdAt: new Date(),
  updatedAt: new Date(),
} as const;

// ─── notifyNewEvent ──────────────────────────────────────────────────────────

describe("notifyNewEvent", () => {
  beforeEach(() => {
    mockSendEmail.mockClear();
  });

  it("sends emails to all subscribed admin users", async () => {
    notifyNewEvent(mockEvent);
    // Wait for the fire-and-forget async to complete
    await new Promise((r) => setTimeout(r, 50));

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
  });

  it("sends to correct email addresses", async () => {
    notifyNewEvent(mockEvent);
    await new Promise((r) => setTimeout(r, 50));

    const recipients = mockSendEmail.mock.calls.map((c: unknown[]) => (c[0] as { to: string }).to);
    expect(recipients).toContain("alice@example.com");
    expect(recipients).toContain("bob@example.com");
  });

  it("includes event title in email subject", async () => {
    notifyNewEvent(mockEvent);
    await new Promise((r) => setTimeout(r, 50));

    const firstCall = mockSendEmail.mock.calls[0][0] as { subject: string };
    expect(firstCall.subject).toContain("Spring Workshop");
  });

  it("does not throw when sendEmail fails", async () => {
    mockSendEmail.mockRejectedValue(new Error("SES down"));

    expect(() => notifyNewEvent(mockEvent)).not.toThrow();
    await new Promise((r) => setTimeout(r, 50));
  });
});

// ─── notifyNewInsight ────────────────────────────────────────────────────────

describe("notifyNewInsight", () => {
  beforeEach(() => {
    mockSendEmail.mockClear();
  });

  it("sends emails to all subscribed admin users", async () => {
    notifyNewInsight(mockInsight);
    await new Promise((r) => setTimeout(r, 50));

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
  });

  it("sends to correct email addresses", async () => {
    notifyNewInsight(mockInsight);
    await new Promise((r) => setTimeout(r, 50));

    const recipients = mockSendEmail.mock.calls.map((c: unknown[]) => (c[0] as { to: string }).to);
    expect(recipients).toContain("alice@example.com");
    expect(recipients).toContain("bob@example.com");
  });

  it("includes insight title in email subject", async () => {
    notifyNewInsight(mockInsight);
    await new Promise((r) => setTimeout(r, 50));

    const firstCall = mockSendEmail.mock.calls[0][0] as { subject: string };
    expect(firstCall.subject).toContain("Interview Prep Guide");
  });

  it("does not throw when sendEmail fails", async () => {
    mockSendEmail.mockRejectedValue(new Error("SES down"));

    expect(() => notifyNewInsight(mockInsight)).not.toThrow();
    await new Promise((r) => setTimeout(r, 50));
  });
});
