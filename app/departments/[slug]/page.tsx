import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ResourceCard } from "@/components/resources/ResourceCard";
import {
  Building2,
  BookOpen,
  FileText,
  Layers,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = await db.department.findUnique({ where: { slug } });
  if (!dept) return { title: "Department Not Found" };
  return {
    title: `${dept.shortName} — ${dept.name} | AU Study Hub`,
    description: `Browse subjects, question papers, notes, and syllabus for Department of ${dept.name} at Anna University.`,
  };
}

export default async function DepartmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  const semFilter = typeof sParams.semester === "string" ? parseInt(sParams.semester, 10) : undefined;
  const regFilter = typeof sParams.regulation === "string" ? sParams.regulation : undefined;

  const department = await db.department.findUnique({
    where: { slug: slug.toLowerCase() },
  });

  if (!department) {
    notFound();
  }

  // Fetch regulations and subjects for this department
  const regulations = await db.regulation.findMany({
    where: { isActive: true },
    orderBy: { applicableFrom: "desc" },
  });

  const subjectWhere: any = {
    departmentId: department.id,
    isActive: true,
  };

  if (regFilter) {
    subjectWhere.regulation = { code: regFilter.toUpperCase() };
  }
  if (semFilter && !isNaN(semFilter)) {
    subjectWhere.semester = { number: semFilter };
  }

  const subjects = await db.subject.findMany({
    where: subjectWhere,
    include: {
      regulation: true,
      semester: true,
      _count: {
        select: { resources: true },
      },
    },
    orderBy: [{ semester: { number: "asc" } }, { code: "asc" }],
  });

  // Fetch recent resources for this department
  const recentResources = await db.resource.findMany({
    where: {
      departmentId: department.id,
      isPublished: true,
    },
    include: {
      subject: true,
      department: true,
      regulation: true,
      semester: true,
      questionPaper: true,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/departments" className="hover:text-blue-600">Departments</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800 uppercase">{department.shortName}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {department.shortName}
              </span>
              <span className="text-xs text-slate-500">B.E. / B.Tech Degree Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {department.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {department.description}
            </p>
          </div>

          <Link
            href={`/search?department=${department.slug}`}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors inline-flex items-center gap-2 shrink-0 shadow-2xs"
          >
            <Search className="w-4 h-4" />
            <span>Search In {department.shortName}</span>
          </Link>
        </div>

        {/* Quick Filter Bar: Semesters & Regulations */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-slate-500 mr-1">Semester:</span>
            <Link
              href={`/departments/${department.slug}`}
              className={`px-2.5 py-1 rounded-md border font-medium ${
                !semFilter
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              All
            </Link>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <Link
                key={s}
                href={`/departments/${department.slug}?semester=${s}${
                  regFilter ? `&regulation=${regFilter}` : ""
                }`}
                className={`px-2.5 py-1 rounded-md border font-medium ${
                  semFilter === s
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                S{s}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 mr-1">Regulation:</span>
            {regulations.map((reg) => (
              <Link
                key={reg.id}
                href={`/departments/${department.slug}?regulation=${reg.code}${
                  semFilter ? `&semester=${semFilter}` : ""
                }`}
                className={`px-2.5 py-1 rounded-md border font-semibold ${
                  regFilter === reg.code
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {reg.code}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Curriculum Subjects ({subjects.length})
          </h2>
          <span className="text-xs text-slate-500">
            Select a subject to discover all past papers, notes, and syllabus
          </span>
        </div>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => (
              <Link
                key={sub.id}
                href={`/search?q=${sub.code}&department=${department.slug}`}
                className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {sub.code}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {sub.regulation.code} • {sub.semester.label}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {sub.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 mt-1 inline-block">
                    Type: {sub.subjectType}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-blue-600">
                    {sub._count.resources} resources
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-blue-600">
                    View Resources →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
            No subjects found for this semester / regulation combination.
          </div>
        )}
      </div>

      {/* Recent Resources in this Department */}
      {recentResources.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Recently Added in {department.shortName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
