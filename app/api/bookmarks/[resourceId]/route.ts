import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let effectiveUser = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    if (!effectiveUser) {
      effectiveUser = await db.user.findFirst({ where: { role: "student" } });
    }

    if (!effectiveUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    await db.bookmark.deleteMany({
      where: {
        userId: effectiveUser.id,
        resourceId,
      },
    });

    return NextResponse.json({ success: true, message: "Bookmark removed" });
  } catch (error) {
    console.error("DELETE /api/bookmarks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
