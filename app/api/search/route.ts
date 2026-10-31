import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { searchParamsSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawParams = {
      q: searchParams.get("q") || undefined,
      department: searchParams.get("department") || undefined,
      regulation: searchParams.get("regulation") || undefined,
      semester: searchParams.get("semester") || undefined,
      type: searchParams.get("type") || "all",
      year: searchParams.get("year") || undefined,
      session: searchParams.get("session") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "12",
    };

    const parsed = searchParamsSchema.safeParse(rawParams);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { q, department, regulation, semester, type, year, session, page, limit } = parsed.data;

    const where: any = {
      isPublished: true,
    };

    // Resource type filter
    if (type && type !== "all") {
      where.resourceType = type;
    }

    // Keyword match on subject code, subject name, or title
    if (q && q.trim()) {
      const cleanQ = q.trim();
      where.OR = [
        {
          subject: {
            code: { contains: cleanQ },
          },
        },
        {
          subject: {
            name: { contains: cleanQ },
          },
        },
        {
          title: { contains: cleanQ },
        },
        {
          description: { contains: cleanQ },
        },
      ];
    }

    // Department filter
    if (department && department !== "all") {
      where.department = {
        OR: [
          { slug: department.toLowerCase() },
          { shortName: { equals: department.toUpperCase() } },
        ],
      };
    }

    // Regulation filter
    if (regulation && regulation !== "all") {
      where.regulation = {
        code: regulation.toUpperCase(),
      };
    }

    // Semester filter
    if (semester && semester !== "all") {
      const semNum = parseInt(semester, 10);
      if (!isNaN(semNum)) {
        where.semester = {
          number: semNum,
        };
      }
    }

    // Year or Session filter on Question Papers
    if ((year && year !== "all") || (session && session !== "all")) {
      const qpWhere: any = {};
      if (year && year !== "all") {
        const yNum = parseInt(year, 10);
        if (!isNaN(yNum)) qpWhere.examYear = yNum;
      }
      if (session && session !== "all") {
        qpWhere.examSession = session;
      }
      where.questionPaper = qpWhere;
    }

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
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to execute search" },
      { status: 500 }
    );
  }
}
