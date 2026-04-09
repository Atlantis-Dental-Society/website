import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { photos } from "@/lib/schema";
import { and, eq, inArray } from "drizzle-orm";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(request: Request) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) return authError;

    const { entityType, entityId, order } = await request.json();

    if (!entityType || !entityId || !Array.isArray(order)) {
      return NextResponse.json(
        { error: "entityType, entityId, and order array are required" },
        { status: 400 },
      );
    }

    if (!["events", "insights"].includes(entityType)) {
      return NextResponse.json(
        { error: "entityType must be 'events' or 'insights'" },
        { status: 400 },
      );
    }

    if (order.length === 0) {
      return NextResponse.json({ success: true });
    }

    if (!order.every((id) => typeof id === "string")) {
      return NextResponse.json({ error: "order must be an array of string ids" }, { status: 400 });
    }

    // Verify every id in `order` belongs to this entity. This prevents
    // cross-entity writes and rejects unknown ids with a clear error.
    const owned = await db
      .select({ id: photos.id })
      .from(photos)
      .where(
        and(
          eq(photos.entityType, entityType),
          eq(photos.entityId, entityId),
          inArray(photos.id, order),
        ),
      );

    if (owned.length !== order.length) {
      return NextResponse.json(
        { error: "one or more photo ids do not belong to this entity" },
        { status: 400 },
      );
    }

    // neon-http does not support transactions, so run the updates in parallel.
    // Each UPDATE is scoped by entityType+entityId as a defense in depth.
    await Promise.all(
      order.map((id, index) =>
        db
          .update(photos)
          .set({ order: index })
          .where(
            and(
              eq(photos.id, id),
              eq(photos.entityType, entityType),
              eq(photos.entityId, entityId),
            ),
          ),
      ),
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
