import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { joinSubmissions, user } from "@/lib/schema";
import { desc, sql } from "drizzle-orm";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tab = searchParams.get("tab") || "applications";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const offset = (page - 1) * PAGE_SIZE;

    if (tab === "users") {
      const [rows, [{ count }]] = await Promise.all([
        db
          .select()
          .from(user)
          .orderBy(desc(user.createdAt))
          .limit(PAGE_SIZE)
          .offset(offset),
        db.select({ count: sql<number>`count(*)::int` }).from(user),
      ]);

      return NextResponse.json({
        data: rows,
        page,
        pageSize: PAGE_SIZE,
        total: count,
        totalPages: Math.ceil(count / PAGE_SIZE),
      });
    }

    // Default: applications (joinSubmissions)
    const [rows, [{ count }]] = await Promise.all([
      db
        .select()
        .from(joinSubmissions)
        .orderBy(desc(joinSubmissions.submittedAt))
        .limit(PAGE_SIZE)
        .offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(joinSubmissions),
    ]);

    return NextResponse.json({
      data: rows,
      page,
      pageSize: PAGE_SIZE,
      total: count,
      totalPages: Math.ceil(count / PAGE_SIZE),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
