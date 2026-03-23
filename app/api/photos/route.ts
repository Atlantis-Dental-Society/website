import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { photos } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: "entityType and entityId query params are required" },
        { status: 400 },
      );
    }

    const result = await db
      .select()
      .from(photos)
      .where(and(eq(photos.entityType, entityType), eq(photos.entityId, entityId)))
      .orderBy(photos.order);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { entityType, entityId, url, key, order } = await request.json();

    if (!entityType || !entityId || !url || !key) {
      return NextResponse.json(
        { error: "entityType, entityId, url, and key are required" },
        { status: 400 },
      );
    }

    const [created] = await db
      .insert(photos)
      .values({ entityType, entityId, url, key, order: order ?? "0" })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
