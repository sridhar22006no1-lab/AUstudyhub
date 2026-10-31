import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate MIME type: only PDF files allowed
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { success: false, error: "Only PDF documents (.pdf) are allowed" },
        { status: 400 }
      );
    }

    // Size limit: 25MB max
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds 25MB limit" },
        { status: 400 }
      );
    }

    // Generate secure randomized filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash = crypto.randomBytes(16).toString("hex");
    const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const fileName = `${hash}_${sanitizedOriginal}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      data: {
        fileUrl: publicUrl,
        fileName: file.name,
        fileSizeBytes: file.size,
      },
    });
  } catch (error) {
    console.error("POST /api/admin/uploads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload and store file" },
      { status: 500 }
    );
  }
}
