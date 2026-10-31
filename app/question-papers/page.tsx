import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { QuestionPaperFilters } from "@/components/question-papers/QuestionPaperFilters";
import { FileText, ChevronRight, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Previous Year Question Papers — Anna University | AU Study Hub",
  description:
    "Browse Anna University engineering previous year question papers across R2021, R2017, and R2023 for Apr/May and Nov/Dec examination sessions.",
};

export default async function QuestionPapersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const deptSlug = typeof params.department === "string" ? params.department : undefined;
  const regCode = typeof params.regulation === "string" ? params.regulation : undefined;
  const semNum = typeof params.semester === "string" ? parseInt(params.semester, 10) : undefined;
  const examYear = typeof params.year === "string" ? parseInt(params.year, 10) : undefined;

  const [departments, regulations, semesters] = await Promise.all([
    db.department.findMany({ where: { isActive: true }, orderBy: { shortName: "asc" } }),
    db.regulation.findMany({ where: { isActive: true }, orderBy: { applicableFrom: "desc" } }),
    db.semester.findMany({ orderBy: { number: "asc" } }),
  ]);

  const where: any = {
    resourceType: "question_paper",
    isPublished: true,
  };

  if (deptSlug && deptSlug !== "all") {
    where.department = { slug: deptSlug.toLowerCase() };
  }
  if (regCode && regCode !== "all") {
    where.regulation = { code: regCode.toUpperCase() };
  }
  if (semNum && !isNaN(semNum)) {
    where.semester = { number: semNum };
  }
  if (examYear && !isNaN(examYear)) {
    where.questionPaper = { examYear };
  }

  const papers = await db.resource.findMany({
    where,
    include: {
      subject: true,
      department: true,
      regulation: true,
      semester: true,
      questionPaper: true,
    },
    orderBy: [{ questionPaper: { examYear: "desc" } }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-10 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-700 text-cyan-300 text-xs font-semibold mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Anna University Examination Papers</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Previous Year Question Papers
          </h1>
          <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
            Browse authentic Anna University end-semester question papers from Apr/May and Nov/Dec exam sessions. Filter systematically by Department, Regulation, Semester, and Examination Year.
          </p>
        </div>

        {/* Step-by-Step Hierarchy Navigation Breadcrumb Pill */}
        <div className="mt-6 pt-4 border-t border-blue-800/60 flex flex-wrap items-center gap-2 text-xs text-blue-200">
          <span className="font-semibold text-white">Browse Hierarchy:</span>
          <span className="px-2 py-0.5 rounded bg-blue-800/60">Department</span>
          <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
          <span className="px-2 py-0.5 rounded bg-blue-800/60">Regulation</span>
          <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
          <span className="px-2 py-0.5 rounded bg-blue-800/60">Semester</span>
          <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
          <span className="px-2 py-0.5 rounded bg-blue-800/60">Subject Code</span>
          <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
          <span className="px-2 py-0.5 rounded bg-blue-800/60">Exam Year / Session</span>
        </div>
      </div>

      {/* Interactive Client-Side Filter Quick-Bar */}
      <Suspense fallback={<div className="bg-white border border-slate-200 rounded-xl p-6 h-32 animate-pulse" />}>
        <QuestionPaperFilters
          departments={departments}
          regulations={regulations}
          semesters={semesters}
          selectedDept={deptSlug}
          selectedReg={regCode}
          selectedSem={semNum}
          selectedYear={examYear}
        />
      </Suspense>

      {/* Results Listing */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">
            Available Question Papers ({papers.length})
          </h2>
          <span className="text-xs text-slate-500">
            Verified university archives with session tags
          </span>
        </div>

        {papers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <ResourceCard key={paper.id} resource={paper} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No verified resource available yet.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              No question papers found for the selected combination. Try clearing your filters or choosing a different regulation.
            </p>
            <div className="pt-2">
              <Link
                href="/question-papers"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors inline-block"
              >
                Show All Question Papers
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
