import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatBytes, formatDate, getResourceTypeBadgeColor, getResourceTypeLabel } from "@/lib/utils";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceDetailClient } from "@/components/resources/ResourceDetailClient";
import {
  FileText,
  BookOpen,
  Layers,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  HardDrive,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = await db.resource.findUnique({
    where: { id },
    include: { subject: true, regulation: true },
  });

  if (!resource) return { title: "Resource Not Found" };

  return {
    title: `${resource.title} | AU Study Hub`,
    description:
      resource.description ||
      `Download and view ${resource.title} for Anna University subject ${resource.subject.code} (${resource.subject.name}) under ${resource.regulation.code}.`,
  };
}

export default async function ResourceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const actionReport = sParams.action === "report";

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
    notFound();
  }

  // Fetch related resources for the same subject code
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
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const badgeColors = getResourceTypeBadgeColor(resource.resourceType);
  const typeLabel = getResourceTypeLabel(resource.resourceType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href={`/departments/${resource.department.slug}`} className="hover:text-blue-600 uppercase">
          {resource.department.shortName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link
          href={`/search?q=${resource.subject.code}`}
          className="hover:text-blue-600 font-mono font-medium"
        >
          {resource.subject.code}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800 truncate max-w-xs">{resource.title}</span>
      </div>

      {/* Main Details Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Top Badges & Verification Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${badgeColors.bg} ${badgeColors.border}`}
            >
              {typeLabel}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {resource.regulation.code}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {resource.semester.label}
            </span>
          </div>

          <div>
            {resource.verificationStatus === "verified" ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {resource.isOfficial ? "Official Anna University Document" : "Verified Academic Material"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Under Quality Verification
              </span>
            )}
          </div>
        </div>

        {/* Title and Subject Overview */}
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-2">
            <span className="font-mono bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs">
              {resource.subject.code}
            </span>
            <span>{resource.subject.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {resource.title}
          </h1>

          {/* Exam Year & Session Banner (For Question Papers) */}
          {resource.questionPaper && (
            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 flex flex-wrap items-center gap-4 text-xs font-medium text-blue-900">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-bold">
                  Examination Session: {resource.questionPaper.examSession} {resource.questionPaper.examYear}
                </span>
              </div>
              <span>•</span>
              <span className="capitalize">Paper Category: {resource.questionPaper.paperKind}</span>
            </div>
          )}

          {/* Description */}
          {resource.description && (
            <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-4xl">
              {resource.description}
            </p>
          )}
        </div>

        {/* Comprehensive Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Department</span>
            <span className="font-semibold text-slate-800">{resource.department.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Curriculum Regulation</span>
            <span className="font-semibold text-slate-800">{resource.regulation.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Format & File Size</span>
            <span className="font-semibold text-slate-800 uppercase">
              {resource.fileType} • {formatBytes(resource.fileSizeBytes)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Cataloged Date</span>
            <span className="font-semibold text-slate-800">{formatDate(resource.createdAt)}</span>
          </div>
        </div>

        {/* Source Citation Box */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-amber-900">Source Repository: </span>
            <span className="text-amber-800 font-medium">{resource.sourceName}</span>
          </div>
          <a
            href={resource.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
          >
            Visit Original Source <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Interactive Actions (Download, Preview, Bookmark, Report Modal) */}
        <div className="pt-2">
          <ResourceDetailClient
            resourceId={resource.id}
            fileUrl={resource.fileUrl}
            externalSourceUrl={resource.externalSourceUrl}
            sourceName={resource.sourceName}
            sourceUrl={resource.sourceUrl}
            initialReportOpen={actionReport}
          />
        </div>
      </div>

      {/* Related Resources for the Same Subject */}
      {relatedResources.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              More Resources for {resource.subject.code} ({resource.subject.name})
            </h2>
            <Link
              href={`/search?q=${resource.subject.code}`}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All Matching →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
