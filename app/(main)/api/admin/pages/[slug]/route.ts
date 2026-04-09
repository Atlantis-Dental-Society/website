import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { pageContent } from "@/lib/schema";
import { pageContentSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const [page] = await db.select().from(pageContent).where(eq(pageContent.slug, slug));
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) return authError;

    const { slug } = await params;
    const body = await request.json();
    const result = pageContentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(pageContent)
      .set({ ...result.data, updatedAt: new Date() })
      .where(eq(pageContent.slug, slug))
      .returning();

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    revalidatePath(`/${slug === "home" ? "" : slug}`);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
