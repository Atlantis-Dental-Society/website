import { NextResponse } from "next/server";
import { getPresignedUploadUrl, getPublicUrl, buildS3Key } from "@/lib/s3";

export async function POST(request: Request) {
  try {
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

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
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
