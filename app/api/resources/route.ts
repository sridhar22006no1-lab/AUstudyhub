import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const subjectId = searchParams.get("subjectId");
    const departmentId = searchParams.get("departmentId");
    const regulationId = searchParams.get("regulationId");
    const semesterId = searchParams.get("semesterId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const where: any = { isPublished: true };

    if (type) where.resourceType = type;
    if (subjectId) where.subjectId = subjectId;
    if (departmentId) where.departmentId = departmentId;
    if (regulationId) where.regulationId = regulationId;
    if (semesterId) where.semesterId = semesterId;

    const skip = (page - 1) * limit;

    const [total, resources] = await Promise.all([
      db.resource.count({ where }),
      db.resource.findMany({
        where,
        include: {
          subject: true,
          department: true,
          regulation: true,
          semester: true,
          questionPaper: true,
        },
        orderBy: [{ isOfficial: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: resources,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("GET /api/resources error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
