import { db } from "./db";
import { user } from "./auth-schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "./ses";
import { buildNewEventEmail, buildNewInsightEmail } from "./email-templates";
import type { events, insights } from "./schema";

async function getSubscribedEmails() {
  const users = await db
    .select({ email: user.email, name: user.name })
    .from(user)
    .where(eq(user.emailNotifications, true));
  return users;
}

export function notifyNewEvent(event: typeof events.$inferSelect) {
  (async () => {
    try {
      const users = await getSubscribedEmails();
      const email = buildNewEventEmail(event);
      await Promise.allSettled(
        users.map((u) =>
          sendEmail({ to: u.email, subject: email.subject, html: email.html, text: email.text }),
        ),
      );
    } catch (err) {
      console.error("[email-notifications] Failed to send event emails:", err);
    }
  })();
}

export function notifyNewInsight(insight: typeof insights.$inferSelect) {
  (async () => {
    try {
      const users = await getSubscribedEmails();
      const email = buildNewInsightEmail(insight);
      await Promise.allSettled(
        users.map((u) =>
          sendEmail({ to: u.email, subject: email.subject, html: email.html, text: email.text }),
        ),
      );
    } catch (err) {
      console.error("[email-notifications] Failed to send insight emails:", err);
    }
  })();
}
