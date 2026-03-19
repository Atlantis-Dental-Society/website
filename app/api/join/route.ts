import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { joinSubmissions } from "@/lib/schema";
import { joinSubmissionSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = joinSubmissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 },
      );
    }

    await db.insert(joinSubmissions).values(result.data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
