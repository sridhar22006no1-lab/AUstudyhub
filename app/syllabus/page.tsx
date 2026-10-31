import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { SyllabusFilters } from "@/components/syllabus/SyllabusFilters";
import { Layers, ShieldCheck, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Official Anna University Syllabus Documents — AU Study Hub",
  description:
    "Official Anna University curriculum, regulations, and course scheme syllabi for B.E. / B.Tech engineering departments under R2021, R2017, and R2023.",
};

export default async function SyllabusPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const deptSlug = typeof params.department === "string" ? params.department : undefined;
  const regCode = typeof params.regulation === "string" ? params.regulation : undefined;

  const [departments, regulations] = await Promise.all([
    db.department.findMany({ where: { isActive: true }, orderBy: { shortName: "asc" } }),
    db.regulation.findMany({ where: { isActive: true }, orderBy: { applicableFrom: "desc" } }),
  ]);

  const where: any = {
    resourceType: "syllabus",
    isPublished: true,
  };

  if (deptSlug && deptSlug !== "all") {
    where.department = { slug: deptSlug.toLowerCase() };
  }
  if (regCode && regCode !== "all") {
    where.regulation = { code: regCode.toUpperCase() };
  }

  const syllabi = await db.resource.findMany({
    where,
    include: {
      subject: true,
      department: true,
      regulation: true,
      semester: true,
      questionPaper: true,
    },
    orderBy: [{ isOfficial: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/80 border border-purple-700 text-purple-300 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Centre for Academic Courses (CAC) Documents</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Curriculum & Official Syllabus
          </h1>
          <p className="mt-3 text-sm sm:text-base text-purple-100 leading-relaxed">
            Verified course outlines, unit distributions, credits, and recommended textbooks published by the Centre for Academic Courses (CAC), Anna University Chennai.
          </p>
        </div>

        {/* Verification Status Legend Pill */}
        <div className="mt-6 pt-4 border-t border-purple-800/60 flex flex-wrap items-center gap-4 text-xs">
          <span className="font-semibold text-purple-200">Document Classification:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Official CAC Document
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
            Authorized Course Scheme
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
            Pending Faculty Review
          </span>
        </div>
      </div>

      {/* Interactive Client-Side Filter Toolbar */}
      <Suspense fallback={<div className="bg-white border border-slate-200 rounded-xl p-6 h-16 animate-pulse" />}>
        <SyllabusFilters
          departments={departments}
          regulations={regulations}
          selectedDept={deptSlug}
          selectedReg={regCode}
        />
      </Suspense>

      {/* Syllabi Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">
            Verified Syllabus Records ({syllabi.length})
          </h2>
          {(deptSlug || regCode) && (
            <Link
              href="/syllabus"
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
            >
              Clear Filters
            </Link>
          )}
        </div>

        {syllabi.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {syllabi.map((item) => (
              <ResourceCard key={item.id} resource={item} />
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
              No official syllabus document is cataloged yet for this branch and regulation filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
