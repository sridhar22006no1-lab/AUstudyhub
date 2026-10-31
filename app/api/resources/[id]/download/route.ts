import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resource = await db.resource.findUnique({ where: { id } });
    if (!resource) {
      return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 });
    }

    await db.resourceEvent.create({
      data: {
        resourceId: id,
        eventType: "download",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        fileUrl: resource.fileUrl,
        externalSourceUrl: resource.externalSourceUrl,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error recording download" }, { status: 500 });
  }
}
