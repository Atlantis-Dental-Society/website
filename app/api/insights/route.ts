import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { insights } from "@/lib/schema";
import { insightSchema } from "@/lib/validations";

export async function GET() {
  try {
    const allInsights = await db.select().from(insights).orderBy(insights.publishedDate);
    return NextResponse.json(allInsights);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = insightSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 },
      );
    }

    const [created] = await db.insert(insights).values(result.data).returning();
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
