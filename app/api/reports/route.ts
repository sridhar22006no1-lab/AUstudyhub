import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reportIssueSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = reportIssueSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten() },
        { status: 400 }
      );
    }

    const { resourceId, reportType, message } = result.data;

    // Verify resource exists
    const resource = await db.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Referenced resource does not exist" },
        { status: 404 }
      );
    }

    const report = await db.resourceReport.create({
      data: {
        resourceId,
        reportType,
        message,
        status: "open",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Issue report submitted successfully. Our team will verify and resolve it.",
      data: report,
    });
  } catch (error) {
    console.error("POST /api/reports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
