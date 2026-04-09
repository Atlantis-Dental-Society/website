import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { joinSubmissions, user } from "@/lib/schema";
import { desc, sql, type SQL, type Table } from "drizzle-orm";
import { requireAdmin } from "@/lib/require-admin";

const PAGE_SIZE = 20;

async function fetchPaginated(table: Table, orderBy: SQL, page: number) {
  const offset = (page - 1) * PAGE_SIZE;
  const [rows, [{ count }]] = await Promise.all([
    db.select().from(table).orderBy(orderBy).limit(PAGE_SIZE).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(table),
  ]);
  return NextResponse.json({
    data: rows,
    page,
    pageSize: PAGE_SIZE,
    total: count,
    totalPages: Math.ceil(count / PAGE_SIZE),
  });
}

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) return authError;

    const { searchParams } = request.nextUrl;
    const tab = searchParams.get("tab") || "applications";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

    if (tab === "users") {
      return fetchPaginated(user, desc(user.createdAt), page);
    }
    return fetchPaginated(joinSubmissions, desc(joinSubmissions.submittedAt), page);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
