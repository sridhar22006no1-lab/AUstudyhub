import Link from "next/link";
import {
  FileText,
  BookOpen,
  Layers,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Download,
  AlertCircle,
  Building,
} from "lucide-react";
import { formatBytes, formatDate, getResourceTypeBadgeColor, getResourceTypeLabel } from "@/lib/utils";

export interface ResourceCardProps {
  id: string;
  resourceType: string;
  title: string;
  description?: string | null;
  fileUrl?: string | null;
  externalSourceUrl?: string | null;
  fileSizeBytes?: number | null;
  sourceName: string;
  sourceUrl: string;
  verificationStatus: string;
  isOfficial: boolean;
  createdAt: Date | string;
  subject: {
    code: string;
    name: string;
  };
  department: {
    name: string;
    shortName: string;
    slug: string;
  };
  regulation: {
    code: string;
  };
  semester: {
    number: number;
    label: string;
  };
  questionPaper?: {
    examYear: number;
    examSession: string;
    paperKind: string;
  } | null;
}

export function ResourceCard({ resource }: { resource: ResourceCardProps }) {
  const badgeColors = getResourceTypeBadgeColor(resource.resourceType);
  const typeLabel = getResourceTypeLabel(resource.resourceType);

  const getIcon = () => {
    switch (resource.resourceType) {
      case "question_paper":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "note":
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case "syllabus":
        return <Layers className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Header row: Type badge, Regulation pill, and Verification indicator */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColors.bg} ${badgeColors.border}`}
            >
              {getIcon()}
              {typeLabel}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {resource.regulation.code}
            </span>
          </div>

          {resource.verificationStatus === "verified" ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {resource.isOfficial ? "Official AU Source" : "Verified Material"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Under Review
            </span>
          )}
        </div>

        {/* Subject code & Course name */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {resource.subject.code}
          </span>
          <span>•</span>
          <span className="truncate">{resource.subject.name}</span>
        </div>

        {/* Resource Title */}
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          <Link href={`/resources/${resource.id}`}>{resource.title}</Link>
        </h3>

        {/* Specific Question Paper Tag */}
        {resource.questionPaper && (
          <div className="mt-2.5 inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50/70 text-blue-900 border border-blue-100">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Exam Session: {resource.questionPaper.examSession} {resource.questionPaper.examYear}
            </span>
            <span className="capitalize text-slate-500 font-normal">
              ({resource.questionPaper.paperKind})
            </span>
          </div>
        )}

        {/* Description preview */}
        {resource.description && (
          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        )}
      </div>

      {/* Footer Meta & Action links */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 space-y-3">
        {/* Source citation */}
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate max-w-[190px]" title={resource.sourceName}>
            Source: <span className="font-medium text-slate-700">{resource.sourceName}</span>
          </span>
          <span>{formatBytes(resource.fileSizeBytes)}</span>
        </div>

        {/* Primary Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/resources/${resource.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-slate-900 hover:bg-blue-600 text-white transition-colors"
          >
            <span>View Resource</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/resources/${resource.id}?action=report`}
            className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
            title="Report issue with this resource"
            aria-label="Report issue"
          >
            <AlertCircle className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
