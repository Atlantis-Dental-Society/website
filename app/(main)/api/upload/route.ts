import { NextResponse } from "next/server";
import { getPresignedUploadUrl, getPublicUrl, buildS3Key } from "@/lib/s3";
import { requireAdmin } from "@/lib/require-admin";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(request: Request) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) return authError;

    const { filename, contentType, entityType, entityId } = await request.json();

    if (!filename || !contentType || !entityType || !entityId) {
      return NextResponse.json(
        { error: "filename, contentType, entityType, and entityId are required" },
        { status: 400 },
      );
    }

    if (!["events", "insights"].includes(entityType)) {
      return NextResponse.json(
        { error: "entityType must be 'events' or 'insights'" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Only image files are allowed (JPEG, PNG, WebP, GIF, AVIF)" },
        { status: 400 },
      );
    }

    const key = buildS3Key(entityType, entityId, filename);
    const presignedUrl = await getPresignedUploadUrl(key, contentType);
    const publicUrl = getPublicUrl(key);

    return NextResponse.json({ presignedUrl, publicUrl, key });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
