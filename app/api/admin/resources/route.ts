import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminResourceSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = adminResourceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Retrieve subject to extract department, regulation, and semester
    const subject = await db.subject.findUnique({
      where: { id: data.subjectId },
      include: { department: true, regulation: true, semester: true },
    });

    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Referenced subject does not exist" },
        { status: 404 }
      );
    }

    const created = await db.resource.create({
      data: {
        title: data.title,
        description: data.description || null,
        resourceType: data.resourceType,
        subjectId: subject.id,
        departmentId: subject.departmentId,
        regulationId: subject.regulationId,
        semesterId: subject.semesterId,
        fileUrl: data.fileUrl || null,
        externalSourceUrl: data.externalSourceUrl || data.sourceUrl,
        fileType: "pdf",
        sourceName: data.sourceName,
        sourceUrl: data.sourceUrl,
        isOfficial: data.isOfficial,
        verificationStatus: data.verificationStatus,
        isPublished: true,
      },
    });

    if (data.resourceType === "question_paper" && data.examYear && data.examSession) {
      await db.questionPaper.create({
        data: {
          resourceId: created.id,
          examYear: data.examYear,
          examSession: data.examSession,
          paperKind: data.paperKind || "regular",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Academic resource created successfully",
      data: created,
    });
  } catch (error) {
    console.error("POST /api/admin/resources error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
