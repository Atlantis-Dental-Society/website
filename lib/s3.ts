import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucket = process.env.AWS_S3_BUCKET || "ads-atlantis-media";

export async function getPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 300 });
  return url;
}

export async function deleteS3Object(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  await s3.send(command);
}

export function getPublicUrl(key: string) {
  const cdnDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
  if (cdnDomain) {
    return `https://${cdnDomain}/${key}`;
  }
  return `https://${bucket}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

export function buildS3Key(entityType: "events" | "insights", entityId: string, filename: string) {
  const ext = filename.includes(".") ? filename.split(".").pop() : "jpg";
  const uuid = crypto.randomUUID();
  return `${entityType}/${entityId}/${uuid}.${ext}`;
}
