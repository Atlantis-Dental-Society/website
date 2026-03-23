import { describe, it, expect } from "vitest";
import { buildS3Key, getPublicUrl } from "./s3";

describe("buildS3Key", () => {
  it("generates a key with UUID filename and correct extension", () => {
    const key = buildS3Key("events", "abc-123", "my-photo.jpg");
    expect(key).toMatch(/^events\/abc-123\/[0-9a-f-]+\.jpg$/);
  });

  it("preserves png extension", () => {
    const key = buildS3Key("insights", "def-456", "screenshot.png");
    expect(key).toMatch(/^insights\/def-456\/[0-9a-f-]+\.png$/);
  });

  it("defaults to jpg when no extension", () => {
    const key = buildS3Key("events", "abc-123", "noext");
    expect(key).toMatch(/^events\/abc-123\/[0-9a-f-]+\.jpg$/);
  });

  it("does not include original filename (uses UUID)", () => {
    const key = buildS3Key("events", "abc-123", "my-photo.jpg");
    expect(key).not.toContain("my-photo");
  });

  it("generates unique keys on each call", () => {
    const key1 = buildS3Key("events", "abc-123", "photo.jpg");
    const key2 = buildS3Key("events", "abc-123", "photo.jpg");
    expect(key1).not.toBe(key2);
  });
});

describe("getPublicUrl", () => {
  it("generates correct S3 URL", () => {
    const url = getPublicUrl("events/abc-123/photo.jpg");
    expect(url).toContain("ads-atlantis-media");
    expect(url).toContain("events/abc-123/photo.jpg");
    expect(url).toMatch(/^https:\/\//);
  });
});
