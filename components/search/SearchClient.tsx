"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  X,
  RotateCcw,
  BookOpen,
  FileText,
  Layers,
  Sparkles,
  ChevronDown,
  Building2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { ResourceCard, ResourceCardProps } from "@/components/resources/ResourceCard";

interface Department {
  id: string;
  slug: string;
  name: string;
  shortName: string;
}

interface Regulation {
  id: string;
  code: string;
  name: string;
}

interface SearchClientProps {
  departments: Department[];
  regulations: Regulation[];
  initialResources: ResourceCardProps[];
  initialTotal: number;
}

export function SearchClient({
  departments,
  regulations,
  initialResources,
  initialTotal,
}: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const qParam = searchParams.get("q") || "";
  const deptParam = searchParams.get("department") || "all";
  const regParam = searchParams.get("regulation") || "all";
  const semParam = searchParams.get("semester") || "all";
  const typeParam = searchParams.get("type") || "all";
  const yearParam = searchParams.get("year") || "all";
  const sessionParam = searchParams.get("session") || "all";

  // Form states
  const [query, setQuery] = useState(qParam);
  const [department, setDepartment] = useState(deptParam);
  const [regulation, setRegulation] = useState(regParam);
  const [semester, setSemester] = useState(semParam);
  const [resourceType, setResourceType] = useState(typeParam);
  const [examYear, setExamYear] = useState(yearParam);
  const [examSession, setExamSession] = useState(sessionParam);

  const [resources, setResources] = useState<ResourceCardProps[]>(initialResources);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setQuery(qParam);
    setDepartment(deptParam);
    setRegulation(regParam);
    setSemester(semParam);
    setResourceType(typeParam);
    setExamYear(yearParam);
    setExamSession(sessionParam);
  }, [qParam, deptParam, regParam, semParam, typeParam, yearParam, sessionParam]);

  // Fetch search results from API
  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (department !== "all") params.set("department", department);
      if (regulation !== "all") params.set("regulation", regulation);
      if (semester !== "all") params.set("semester", semester);
      if (resourceType !== "all") params.set("type", resourceType);
      if (examYear !== "all") params.set("year", examYear);
      if (examSession !== "all") params.set("session", examSession);

      const res = await fetch(`/api/search?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setResources(json.data);
        setTotal(json.meta.total);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [query, department, regulation, semester, resourceType, examYear, examSession]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (department !== "all") params.set("department", department);
    if (regulation !== "all") params.set("regulation", regulation);
    if (semester !== "all") params.set("semester", semester);
    if (resourceType !== "all") params.set("type", resourceType);
    if (examYear !== "all") params.set("year", examYear);
    if (examSession !== "all") params.set("session", examSession);

    router.push(`/search?${params.toString()}`);
    fetchResults();
    setMobileFiltersOpen(false);
  };

  const handleResetFilters = () => {
    setQuery("");
    setDepartment("all");
    setRegulation("all");
    setSemester("all");
    setResourceType("all");
    setExamYear("all");
    setExamSession("all");
    router.push("/search");
    setTimeout(() => {
      fetchResults();
    }, 50);
  };

  const hasActiveFilters =
    query.trim() !== "" ||
    department !== "all" ||
    regulation !== "all" ||
    semester !== "all" ||
    resourceType !== "all" ||
    examYear !== "all" ||
    examSession !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Smart Academic Search
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Search across Anna University question papers, notes, and syllabus documents with instant filters.
        </p>

        {/* Global Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
              placeholder="Search by subject code (e.g. CS3251, MA3151) or course name..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base outline-none bg-white shadow-2xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleApplyFilters}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-2xs shrink-0 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="sm:hidden px-4 py-3 bg-white border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Quick subject hints */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Suggestions:</span>
          {["CS3251", "MA3151", "CS3301", "CS3492", "GE3151", "EC3352"].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setQuery(code);
                const params = new URLSearchParams(searchParams.toString());
                params.set("q", code);
                router.push(`/search?${params.toString()}`);
                setTimeout(() => fetchResults(), 50);
              }}
              className="font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar (Desktop + Mobile Responsive) */}
        <div
          className={`lg:block ${
            mobileFiltersOpen ? "block" : "hidden"
          } bg-white border border-slate-200 rounded-2xl p-5 shadow-xs h-fit space-y-6`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Filter 1: Resource Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Resource Type
            </label>
            <div className="space-y-1.5 text-sm">
              {[
                { val: "all", label: "All Resources", icon: Sparkles },
                { val: "question_paper", label: "Question Papers", icon: FileText },
                { val: "note", label: "Subject Notes", icon: BookOpen },
                { val: "syllabus", label: "Official Syllabus", icon: Layers },
              ].map((item) => {
                const Icon = item.icon;
                const active = resourceType === item.val;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setResourceType(item.val)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-medium transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter 2: Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Department / Branch
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.shortName} — {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 3: Regulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Regulation
            </label>
            <select
              value={regulation}
              onChange={(e) => setRegulation(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Regulations</option>
              {regulations.map((r) => (
                <option key={r.id} value={r.code}>
                  {r.code} ({r.name})
                </option>
              ))}
            </select>
          </div>

          {/* Filter 4: Semester */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Semester
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setSemester("all")}
                className={`py-1.5 text-xs font-semibold rounded-md border text-center ${
                  semester === "all"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                All
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSemester(s.toString())}
                  className={`py-1.5 text-xs font-semibold rounded-md border text-center ${
                    semester === s.toString()
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  S{s}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 5: Exam Year & Session (For Question Papers) */}
          {resourceType !== "notes" && resourceType !== "syllabus" && (
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Exam Year & Session
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                >
                  <option value="all">Any Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
                <select
                  value={examSession}
                  onChange={(e) => setExamSession(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                >
                  <option value="all">Any Session</option>
                  <option value="Apr/May">Apr/May</option>
                  <option value="Nov/Dec">Nov/Dec</option>
                </select>
              </div>
            </div>
          )}

          {/* Apply button */}
          <button
            type="button"
            onClick={handleApplyFilters}
            className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs"
          >
            Apply Filters
          </button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3">
          {/* Status bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200">
            <div className="text-sm font-semibold text-slate-800">
              {loading ? (
                <span>Searching academic curriculum...</span>
              ) : (
                <span>
                  Found <span className="text-blue-600 font-bold">{total}</span> matching verified resources
                </span>
              )}
            </div>

            {/* Active filter badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {query && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    &ldquo;{query}&rdquo;
                  </span>
                )}
                {regulation !== "all" && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {regulation}
                  </span>
                )}
                {department !== "all" && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                    {department}
                  </span>
                )}
                {semester !== "all" && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    Sem {semester}
                  </span>
                )}
                {resourceType !== "all" && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize">
                    {resourceType.replace("_", " ")}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-slate-400 hover:text-slate-600 ml-1 text-xs underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Grid / Loading / Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse space-y-3 h-52"
                >
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          ) : (
            /* Explicit Empty State required by user prompt */
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No verified resource available yet.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                We couldn&apos;t find any verified question papers, lecture notes, or syllabus matching your specific query.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
                >
                  Clear Filters & Browse All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
