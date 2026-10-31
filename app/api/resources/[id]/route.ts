import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const resource = await db.resource.findUnique({
      where: { id },
      include: {
        subject: true,
        department: true,
        regulation: true,
        semester: true,
        questionPaper: true,
      },
    });

    if (!resource || !resource.isPublished) {
      return NextResponse.json(
        { success: false, error: "Resource not found or unpublished" },
        { status: 404 }
      );
    }

    // Fetch related resources for the same subject
    const relatedResources = await db.resource.findMany({
      where: {
        subjectId: resource.subjectId,
        id: { not: resource.id },
        isPublished: true,
      },
      include: {
        subject: true,
        department: true,
        regulation: true,
        semester: true,
        questionPaper: true,
      },
      take: 6,
    });

    // Record view telemetry asynchronously
    await db.resourceEvent.create({
      data: {
        resourceId: resource.id,
        eventType: "view",
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      data: {
        ...resource,
        relatedResources,
      },
    });
  } catch (error) {
    console.error("GET /api/resources/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resource details" },
      { status: 500 }
    );
  }
}
