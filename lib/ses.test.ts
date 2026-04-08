import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted so the mock fn is available inside vi.mock (which gets hoisted)
const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn().mockResolvedValue({}),
}));

vi.mock("@aws-sdk/client-sesv2", () => {
  return {
    SESv2Client: class {
      send = mockSend;
    },
    SendEmailCommand: class {
      constructor(public input: unknown) {}
    },
  };
});

import { sendEmail } from "./ses";

describe("sendEmail", () => {
  beforeEach(() => {
    mockSend.mockClear();
  });

  it("calls SES send with correct parameters", async () => {
    await sendEmail({
      to: "user@example.com",
      subject: "Test Subject",
      html: "<h1>Hello</h1>",
      text: "Hello",
    });

    expect(mockSend).toHaveBeenCalledOnce();
    const command = mockSend.mock.calls[0][0] as { input: Record<string, unknown> };
    expect(command.input).toMatchObject({
      Destination: { ToAddresses: ["user@example.com"] },
      Content: {
        Simple: {
          Subject: { Data: "Test Subject" },
          Body: {
            Html: { Data: "<h1>Hello</h1>" },
            Text: { Data: "Hello" },
          },
        },
      },
    });
  });

  it("includes FromEmailAddress", async () => {
    await sendEmail({
      to: "user@example.com",
      subject: "Test",
      html: "<p>Hi</p>",
      text: "Hi",
    });

    const command = mockSend.mock.calls[0][0] as { input: Record<string, unknown> };
    expect(command.input.FromEmailAddress).toBeDefined();
    expect(typeof command.input.FromEmailAddress).toBe("string");
  });

  it("propagates SES errors", async () => {
    mockSend.mockRejectedValueOnce(new Error("SES quota exceeded"));

    await expect(
      sendEmail({
        to: "user@example.com",
        subject: "Test",
        html: "<p>Hi</p>",
        text: "Hi",
      }),
    ).rejects.toThrow("SES quota exceeded");
  });
});
