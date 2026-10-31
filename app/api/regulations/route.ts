import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const regulations = await db.regulation.findMany({
      where: { isActive: true },
      orderBy: { applicableFrom: "desc" },
    });
    return NextResponse.json({ success: true, data: regulations });
  } catch (error) {
    console.error("GET /api/regulations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch regulations" },
      { status: 500 }
    );
  }
}
