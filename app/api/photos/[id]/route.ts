import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { photos } from "@/lib/schema";
import { deleteS3Object } from "@/lib/s3";
import { eq } from "drizzle-orm";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));

    if (!photo) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteS3Object(photo.key);
    await db.delete(photos).where(eq(photos.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
