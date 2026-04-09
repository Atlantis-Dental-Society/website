import type { events, insights } from "./schema";
import { escapeHtml } from "./escape-html";

const baseUrl = process.env.BETTER_AUTH_URL || "https://atlantisdentalsociety.ca";

function wrapHtml(content: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#FAF5ED;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF5ED;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <!-- Header -->
  <tr><td style="padding:0 0 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:20px;font-weight:800;color:#2D2419;letter-spacing:-0.025em;">Atlantis Dental Society</td>
      </tr>
      <tr><td style="padding-top:8px;"><div style="height:3px;width:48px;background-color:#D4AF37;border-radius:2px;"></div></td></tr>
    </table>
  </td></tr>
  <!-- Content -->
  <tr><td style="background-color:#ffffff;border-radius:16px;padding:40px 36px;">
    ${content}
  </td></tr>
  <!-- Footer -->
  <tr><td style="padding:32px 0 0 0;text-align:center;">
    <p style="margin:0;font-size:12px;color:#9C8B7A;">Atlantis Dental Society</p>
    <p style="margin:4px 0 0 0;font-size:11px;color:#BDB0A3;">You received this because you have an ADS account. Manage your preferences in your account settings.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function ctaButton(text: string, href: string) {
  return `<table cellpadding="0" cellspacing="0" style="margin:28px 0 0 0;">
<tr><td style="background-color:#D4AF37;border-radius:9999px;padding:14px 32px;">
  <a href="${href}" style="color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;display:inline-block;">${text}</a>
</td></tr>
</table>`;
}

export function buildNewEventEmail(event: typeof events.$inferSelect) {
  const dateStr = event.date
    ? new Date(event.date + "T00:00:00").toLocaleDateString("en", { dateStyle: "long" })
    : "";
  const details = [dateStr, event.time, event.location].filter(Boolean).join(" &mdash; ");

  const html = wrapHtml(`
    <p style="margin:0;font-size:13px;font-weight:600;color:#D4AF37;text-transform:uppercase;letter-spacing:0.05em;">New Event</p>
    <h1 style="margin:8px 0 0 0;font-size:24px;font-weight:800;color:#2D2419;line-height:1.3;">${escapeHtml(event.title)}</h1>
    ${details ? `<p style="margin:12px 0 0 0;font-size:14px;color:#7B916F;font-weight:600;">${escapeHtml(details)}</p>` : ""}
    ${event.description ? `<p style="margin:16px 0 0 0;font-size:15px;color:#5C5147;line-height:1.6;">${escapeHtml(event.description)}</p>` : ""}
    ${ctaButton("View Event", `${baseUrl}/events`)}
  `);

  const text = [
    `New Event: ${event.title}`,
    details,
    event.description,
    `View event: ${baseUrl}/events`,
  ].filter(Boolean).join("\n\n");

  return { subject: `New Event: ${event.title}`, html, text };
}

export function buildNewInsightEmail(insight: typeof insights.$inferSelect) {
  const html = wrapHtml(`
    <p style="margin:0;font-size:13px;font-weight:600;color:#D4AF37;text-transform:uppercase;letter-spacing:0.05em;">New Insight</p>
    <h1 style="margin:8px 0 0 0;font-size:24px;font-weight:800;color:#2D2419;line-height:1.3;">${escapeHtml(insight.title)}</h1>
    ${insight.author ? `<p style="margin:12px 0 0 0;font-size:14px;color:#7B916F;">By ${escapeHtml(insight.author)}</p>` : ""}
    ${insight.excerpt ? `<p style="margin:16px 0 0 0;font-size:15px;color:#5C5147;line-height:1.6;">${escapeHtml(insight.excerpt)}</p>` : ""}
    ${ctaButton("Read More", `${baseUrl}/insights/${escapeHtml(insight.slug)}`)}
  `);

  const text = [
    `New Insight: ${insight.title}`,
    insight.author ? `By ${insight.author}` : "",
    insight.excerpt,
    `Read more: ${baseUrl}/insights/${insight.slug}`,
  ].filter(Boolean).join("\n\n");

  return { subject: `New Insight: ${insight.title}`, html, text };
}

export function buildPasswordResetEmail(url: string, userName?: string | null) {
  const greeting = userName ? `Hi ${userName},` : "Hi,";

  const html = wrapHtml(`
    <h1 style="margin:0;font-size:24px;font-weight:800;color:#2D2419;">${escapeHtml(greeting)}</h1>
    <p style="margin:16px 0 0 0;font-size:15px;color:#5C5147;line-height:1.6;">We received a request to reset your password. Click the button below to choose a new one.</p>
    ${ctaButton("Reset Password", url)}
    <p style="margin:24px 0 0 0;font-size:13px;color:#9C8B7A;line-height:1.5;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
  `);

  const text = [
    greeting,
    "We received a request to reset your password.",
    `Reset your password: ${url}`,
    "This link expires in 1 hour. If you didn't request this, ignore this email.",
  ].join("\n\n");

  return { subject: "Reset Your Password — Atlantis Dental Society", html, text };
}
