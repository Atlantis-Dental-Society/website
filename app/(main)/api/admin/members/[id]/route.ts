import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    const { role } = await request.json();

    if (role !== "admin" && role !== "user") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const [updated] = await db
      .update(user)
      .set({ role })
      .where(eq(user.id, id))
      .returning();

    if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
