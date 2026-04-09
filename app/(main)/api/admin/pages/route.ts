import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageContent } from "@/lib/schema";

export async function GET() {
  try {
    const pages = await db.select().from(pageContent).orderBy(pageContent.slug);
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
