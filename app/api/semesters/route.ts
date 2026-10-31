import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const semesters = await db.semester.findMany({
      orderBy: { number: "asc" },
    });
    return NextResponse.json({ success: true, data: semesters });
  } catch (error) {
    console.error("GET /api/semesters error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch semesters" },
      { status: 500 }
    );
  }
}
