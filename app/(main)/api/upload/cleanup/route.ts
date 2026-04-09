import { NextResponse } from "next/server";
import { deleteS3Object } from "@/lib/s3";
import { requireAdmin } from "@/lib/require-admin";

// Deletes an S3 object that was uploaded via the presigned-URL flow but never
// committed to the photos table (staged photo removed or dialog closed without
// saving). Scoped to media keys only so it can't be used to delete arbitrary
// bucket objects.
export async function POST(request: Request) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) return authError;

    const { key } = await request.json();

    if (typeof key !== "string" || key.length === 0) {
      return NextResponse.json({ error: "key is required" }, { status: 400 });
    }

    if (!key.startsWith("events/") && !key.startsWith("insights/")) {
      return NextResponse.json(
        { error: "key must be under events/ or insights/" },
        { status: 400 },
      );
    }

    await deleteS3Object(key);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
