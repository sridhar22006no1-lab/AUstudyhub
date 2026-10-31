import Link from "next/link";
import { db } from "@/lib/db";
import { Building2, Binary, Cpu, Radio, Zap, Wrench, Compass, BrainCircuit, Activity, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Engineering Departments & Degree Branches — AU Study Hub",
  description:
    "Explore Anna University engineering branches: Computer Science, ECE, IT, EEE, Mechanical, Civil, AI & Data Science, and Biomedical.",
};

const DEPT_ICONS: Record<string, any> = {
  cse: Binary,
  it: Cpu,
  ece: Radio,
  eee: Zap,
  mech: Wrench,
  civil: Compass,
  aids: BrainCircuit,
  bme: Activity,
};

export default async function DepartmentsPage() {
  const departments = await db.department.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { subjects: true, resources: true },
      },
    },
    orderBy: { shortName: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-700 text-cyan-300 text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>Undergraduate B.E. / B.Tech Engineering</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Academic Departments Catalog
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Select your engineering discipline to view mapped subjects across Semesters 1 through 8, question papers, verified lecture notes, and official regulation syllabi.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const Icon = DEPT_ICONS[dept.slug] || Binary;
          return (
            <Link
              key={dept.id}
              href={`/departments/${dept.slug}`}
              className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {dept.shortName}
                  </span>
                  <span className="text-xs text-slate-400">Anna Univ B.E./B.Tech</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {dept.name}
                </h2>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-3">
                  <span>{dept._count.subjects} Subjects</span>
                  <span>•</span>
                  <span>{dept._count.resources} Resources</span>
                </div>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Subjects <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
