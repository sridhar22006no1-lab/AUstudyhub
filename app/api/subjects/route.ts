import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const regulation = searchParams.get("regulation");
    const semester = searchParams.get("semester");
    const q = searchParams.get("q");

    const where: any = { isActive: true };

    if (department) {
      where.department = {
        OR: [{ slug: department.toLowerCase() }, { shortName: department.toUpperCase() }],
      };
    }

    if (regulation) {
      where.regulation = { code: regulation.toUpperCase() };
    }

    if (semester) {
      where.semester = { number: parseInt(semester, 10) };
    }

    if (q) {
      where.OR = [
        { code: { contains: q } },
        { name: { contains: q } },
      ];
    }

    const subjects = await db.subject.findMany({
      where,
      include: {
        department: true,
        regulation: true,
        semester: true,
        _count: {
          select: { resources: true },
        },
      },
      orderBy: [{ code: "asc" }],
    });

    return NextResponse.json({ success: true, data: subjects });
  } catch (error) {
    console.error("GET /api/subjects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
