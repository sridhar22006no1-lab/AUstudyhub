import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { NotesFilters } from "@/components/notes/NotesFilters";
import { BookOpen, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Subject Notes & Study Materials — Anna University | AU Study Hub",
  description:
    "Curated lecture notes, unit-wise formula sheets, and solved questions for Anna University engineering courses.",
};

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const deptSlug = typeof params.department === "string" ? params.department : undefined;
  const semNum = typeof params.semester === "string" ? parseInt(params.semester, 10) : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;

  const [departments, semesters] = await Promise.all([
    db.department.findMany({ where: { isActive: true }, orderBy: { shortName: "asc" } }),
    db.semester.findMany({ orderBy: { number: "asc" } }),
  ]);

  const where: any = {
    resourceType: "note",
    isPublished: true,
  };

  if (deptSlug && deptSlug !== "all") {
    where.department = { slug: deptSlug.toLowerCase() };
  }
  if (semNum && !isNaN(semNum)) {
    where.semester = { number: semNum };
  }
  if (q && q.trim()) {
    where.OR = [
      { subject: { code: { contains: q.trim() } } },
      { subject: { name: { contains: q.trim() } } },
      { title: { contains: q.trim() } },
    ];
  }

  const notes = await db.resource.findMany({
    where,
    include: {
      subject: true,
      department: true,
      regulation: true,
      semester: true,
      questionPaper: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-6 sm:p-10 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-teal-300 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Authorized Course Handouts</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Subject Notes & Study Materials
          </h1>
          <p className="mt-3 text-sm sm:text-base text-teal-100 leading-relaxed">
            Access unit-wise revision notes, formula sheets, and solved problems curated according to Anna University syllabus. Each material lists its source faculty or educational repository.
          </p>
        </div>
      </div>

      {/* Interactive Client-Side Filter & Search Bar */}
      <Suspense fallback={<div className="bg-white border border-slate-200 rounded-xl p-6 h-20 animate-pulse" />}>
        <NotesFilters
          departments={departments}
          semesters={semesters}
          selectedDept={deptSlug}
          selectedSem={semNum}
          initialQuery={q}
        />
      </Suspense>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">
            Available Study Materials ({notes.length})
          </h2>
          {(deptSlug || semNum || q) && (
            <Link href="/notes" className="text-xs text-rose-600 hover:text-rose-800 font-semibold">
              Reset Filters
            </Link>
          )}
        </div>

        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <ResourceCard key={note.id} resource={note} />
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
              No study notes currently verified for this query. Notes undergo quality verification before being published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
