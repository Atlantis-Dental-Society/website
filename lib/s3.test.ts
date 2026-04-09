import { describe, it, expect } from "vitest";
import { buildS3Key, getPublicUrl } from "./s3";

// Fixed UUIDs for deterministic tests. buildS3Key validates entityId as a
// canonical UUID and throws otherwise.
const EVENT_ID = "00000000-0000-0000-0000-000000000001";
const INSIGHT_ID = "00000000-0000-0000-0000-000000000002";

describe("buildS3Key", () => {
  it("generates a key with UUID filename and correct extension", () => {
    const key = buildS3Key("events", EVENT_ID, "my-photo.jpg");
    expect(key).toMatch(new RegExp(`^events/${EVENT_ID}/[0-9a-f-]+\\.jpg$`));
  });

  it("preserves png extension", () => {
    const key = buildS3Key("insights", INSIGHT_ID, "screenshot.png");
    expect(key).toMatch(new RegExp(`^insights/${INSIGHT_ID}/[0-9a-f-]+\\.png$`));
  });

  it("defaults to jpg when no extension", () => {
    const key = buildS3Key("events", EVENT_ID, "noext");
    expect(key).toMatch(new RegExp(`^events/${EVENT_ID}/[0-9a-f-]+\\.jpg$`));
  });

  it("does not include original filename (uses UUID)", () => {
    const key = buildS3Key("events", EVENT_ID, "my-photo.jpg");
    expect(key).not.toContain("my-photo");
  });

  it("generates unique keys on each call", () => {
    const key1 = buildS3Key("events", EVENT_ID, "photo.jpg");
    const key2 = buildS3Key("events", EVENT_ID, "photo.jpg");
    expect(key1).not.toBe(key2);
  });

  it("rejects non-UUID entityId", () => {
    expect(() => buildS3Key("events", "abc-123", "photo.jpg")).toThrow("Invalid entityId");
  });
});

describe("getPublicUrl", () => {
  it("generates correct URL containing the key", () => {
    const url = getPublicUrl("events/abc-123/photo.jpg");
    expect(url).toContain("events/abc-123/photo.jpg");
    expect(url).toMatch(/^https:\/\//);
  });
});
