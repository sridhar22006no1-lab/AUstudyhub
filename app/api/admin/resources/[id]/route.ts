import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await db.resource.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 });
    }

    const updated = await db.resource.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        description: body.description !== undefined ? body.description : undefined,
        verificationStatus: body.verificationStatus !== undefined ? body.verificationStatus : undefined,
        isPublished: body.isPublished !== undefined ? body.isPublished : undefined,
        isOfficial: body.isOfficial !== undefined ? body.isOfficial : undefined,
        sourceName: body.sourceName !== undefined ? body.sourceName : undefined,
        sourceUrl: body.sourceUrl !== undefined ? body.sourceUrl : undefined,
        fileUrl: body.fileUrl !== undefined ? body.fileUrl : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Resource updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/resources/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.resource.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Resource deleted permanently",
    });
  } catch (error) {
    console.error("DELETE /api/admin/resources/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
