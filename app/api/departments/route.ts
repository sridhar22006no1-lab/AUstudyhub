import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const departments = await db.department.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { subjects: true, resources: true },
        },
      },
      orderBy: { shortName: "asc" },
    });
    return NextResponse.json({ success: true, data: departments });
  } catch (error) {
    console.error("GET /api/departments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}
