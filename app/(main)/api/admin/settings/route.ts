import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/schema";
import { siteConfigSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  try {
    const [config] = await db.select().from(siteConfig).limit(1);
    if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();
    const result = siteConfigSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 },
      );
    }

    const [existing] = await db.select({ id: siteConfig.id }).from(siteConfig).limit(1);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [updated] = await db
      .update(siteConfig)
      .set({ ...result.data, updatedAt: new Date() })
      .where((await import("drizzle-orm")).eq(siteConfig.id, existing.id))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
