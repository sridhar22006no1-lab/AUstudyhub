import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Fetch bookmarks for requested user, or return default student bookmarks
    const user = userId
      ? await db.user.findUnique({ where: { id: userId } })
      : await db.user.findFirst({ where: { role: "student" } });

    if (!user) {
      return NextResponse.json({ success: true, data: [] });
    }

    const bookmarks = await db.bookmark.findMany({
      where: { userId: user.id },
      include: {
        resource: {
          include: {
            subject: true,
            department: true,
            regulation: true,
            semester: true,
            questionPaper: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: bookmarks });
  } catch (error) {
    console.error("GET /api/bookmarks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resourceId, userId } = body;

    if (!resourceId) {
      return NextResponse.json(
        { success: false, error: "resourceId is required" },
        { status: 400 }
      );
    }

    // Resolve user (or use student account)
    let effectiveUser = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    if (!effectiveUser) {
      effectiveUser = await db.user.findFirst({ where: { role: "student" } });
    }

    if (!effectiveUser) {
      return NextResponse.json(
        { success: false, error: "No student profile available" },
        { status: 400 }
      );
    }

    // Check if already bookmarked
    const existing = await db.bookmark.findUnique({
      where: {
        userId_resourceId: {
          userId: effectiveUser.id,
          resourceId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Resource already bookmarked",
        data: existing,
      });
    }

    const bookmark = await db.bookmark.create({
      data: {
        userId: effectiveUser.id,
        resourceId,
      },
      include: {
        resource: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Resource saved to bookmarks",
      data: bookmark,
    });
  } catch (error) {
    console.error("POST /api/bookmarks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}
