import Link from "next/link";
import { db } from "@/lib/db";
import { HeroSearch } from "@/components/search/HeroSearch";
import { ResourceCard } from "@/components/resources/ResourceCard";
import {
  FileText,
  BookOpen,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Cpu,
  Binary,
  Radio,
  Zap,
  Wrench,
  Compass,
  BrainCircuit,
  Activity,
  CheckCircle2,
  Lock,
  ExternalLink,
} from "lucide-react";

// Department icon mapping
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

export const revalidate = 60; // Cache for 60 seconds

export default async function HomePage() {
  // Fetch departments, regulations, recently added and popular resources
  const departments = await db.department.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { resources: true, subjects: true },
      },
    },
    orderBy: { shortName: "asc" },
  });

  const regulations = await db.regulation.findMany({
    where: { isActive: true },
    orderBy: { applicableFrom: "desc" },
  });

  const recentlyAdded = await db.resource.findMany({
    where: { isPublished: true },
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

  const totalResources = await db.resource.count({ where: { isPublished: true } });
  const totalQuestionPapers = await db.resource.count({
    where: { resourceType: "question_paper", isPublished: true },
  });
  const totalNotes = await db.resource.count({
    where: { resourceType: "note", isPublished: true },
  });
  const totalSyllabus = await db.resource.count({
    where: { resourceType: "syllabus", isPublished: true },
  });

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Anna University Curriculum Portal • R2021, R2017, R2023</span>
          </div>

          {/* Main Headline & Subheading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight sm:leading-tight">
            Your Complete <span className="text-blue-600">Academic Resource Hub</span>
          </h1>
          <p className="mt-4 sm:mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find Anna University previous year question papers, subject notes, and official syllabus documents in one place.
          </p>

          {/* Prominent Search Bar */}
          <div className="mt-8 sm:mt-10">
            <HeroSearch />
          </div>

          {/* Regulation & Semester Quick Jump Pill Bar */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
              Fast Jump:
            </span>
            <div className="flex flex-wrap gap-1.5 items-center">
              {regulations.map((reg) => (
                <Link
                  key={reg.id}
                  href={`/search?regulation=${reg.code}`}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-semibold transition-colors shadow-2xs"
                >
                  {reg.code}
                </Link>
              ))}
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex flex-wrap gap-1 items-center">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <Link
                  key={sem}
                  href={`/search?semester=${sem}`}
                  className="w-7 h-7 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400 font-bold flex items-center justify-center transition-colors shadow-2xs"
                  title={`Semester ${sem}`}
                >
                  S{sem}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick-Access Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Browse by Resource Type
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Direct access to question papers, comprehensive notes, and official curriculum syllabi
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 group"
          >
            <span>Open Advanced Filter</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Question Papers */}
          <Link
            href="/question-papers"
            className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 group-hover:bg-blue-100 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Question Papers
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {totalQuestionPapers} Available
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                Browse semester exam papers from Apr/May & Nov/Dec sessions. Filter by department, regulation, and year.
              </p>
            </div>
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Explore Question Papers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Subject Notes */}
          <Link
            href="/notes"
            className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 group-hover:bg-emerald-100 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Subject Notes
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {totalNotes} Available
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                Curated unit-wise lecture handouts, formula revisions, and solved question sets aligned with curriculum outcomes.
              </p>
            </div>
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Browse Lecture Notes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Syllabus Documents */}
          <Link
            href="/syllabus"
            className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-purple-400 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0 group-hover:bg-purple-100 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Official Syllabus
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {totalSyllabus} Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                Direct authorized curriculum circulars and course schemes from Centre for Academic Courses, Anna University.
              </p>
            </div>
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
              <span>View Official Syllabi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Department Selector Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Engineering Departments
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your branch to view all mapped subjects across Semesters 1 to 8
            </p>
          </div>
          <Link
            href="/departments"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 group"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const Icon = DEPT_ICONS[dept.slug] || Binary;
            return (
              <Link
                key={dept.id}
                href={`/departments/${dept.slug}`}
                className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-slate-900 group-hover:text-blue-600">
                      {dept.shortName}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-slate-600 line-clamp-1 leading-snug">
                    {dept.name}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{dept._count.subjects} subjects</span>
                  <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Recently Added Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Recently Added Resources
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Latest authenticated question papers, lecture handouts, and official course outlines
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 group"
          >
            <span>View All ({totalResources})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {recentlyAdded.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyAdded.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-sm text-slate-500">No verified resource available yet.</p>
          </div>
        )}
      </section>

      {/* 5. Trust & Verification Pillar Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-slate-900 rounded-2xl text-white p-8 sm:p-10 border border-slate-800">
          <div className="max-w-3xl">
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
              Academic Integrity First
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Built Specifically for Anna University Students
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              We know how difficult it is to find genuine question papers and correct regulation syllabi before university exams. AU Study Hub enforces strict criteria before anything is listed:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-950 text-cyan-300 border border-blue-800 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Strict Subject Code Verification</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Every paper is matched to official university subject codes (e.g. CS3251, MA3151) and regulation batches.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-950 text-cyan-300 border border-blue-800 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Original Source Attribution</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  All syllabi point directly to Centre for Academic Courses (cac.annauniv.edu) and Controller of Examinations archives.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-950 text-cyan-300 border border-blue-800 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">No Forced Signups or Paywalls</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Instant search, instant PDF previews, and direct access for every student across Tamil Nadu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
