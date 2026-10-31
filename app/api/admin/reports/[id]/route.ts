import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["open", "investigating", "resolved", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const updated = await db.resourceReport.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: `Report status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/reports/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update report status" },
      { status: 500 }
    );
  }
}
