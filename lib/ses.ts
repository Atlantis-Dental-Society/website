import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const fromEmail = process.env.SES_FROM_EMAIL || "noreply@atlantisdentalsociety.com";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const command = new SendEmailCommand({
    FromEmailAddress: fromEmail,
    Destination: { ToAddresses: [to] },
    Content: {
      Simple: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: html },
          Text: { Data: text },
        },
      },
    },
  });

  await ses.send(command);
}
