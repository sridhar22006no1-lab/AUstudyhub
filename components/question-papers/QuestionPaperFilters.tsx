"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter } from "lucide-react";

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

interface Semester {
  id: string;
  number: number;
  label: string;
}

interface QuestionPaperFiltersProps {
  departments: Department[];
  regulations: Regulation[];
  semesters: Semester[];
  selectedDept?: string;
  selectedReg?: string;
  selectedSem?: number;
  selectedYear?: number;
}

export function QuestionPaperFilters({
  departments,
  regulations,
  semesters,
  selectedDept,
  selectedReg,
  selectedSem,
  selectedYear,
}: QuestionPaperFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/question-papers?${params.toString()}`);
  };

  const hasActiveFilters = Boolean(
    (selectedDept && selectedDept !== "all") ||
      (selectedReg && selectedReg !== "all") ||
      selectedSem ||
      selectedYear
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Question Papers</span>
        </div>
        {hasActiveFilters && (
          <Link
            href="/question-papers"
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold transition-colors"
          >
            Reset Filters
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Department Dropdown */}
        <div>
          <label htmlFor="qp-department-select" className="block text-xs font-medium text-slate-500 mb-1">
            Department
          </label>
          <select
            id="qp-department-select"
            value={selectedDept || "all"}
            onChange={(e) => handleFilterChange("department", e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.slug}>
                {d.shortName} ({d.name})
              </option>
            ))}
          </select>
        </div>

        {/* Regulation Dropdown */}
        <div>
          <label htmlFor="qp-regulation-select" className="block text-xs font-medium text-slate-500 mb-1">
            Regulation
          </label>
          <select
            id="qp-regulation-select"
            value={selectedReg || "all"}
            onChange={(e) => handleFilterChange("regulation", e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Regulations</option>
            {regulations.map((r) => (
              <option key={r.id} value={r.code}>
                {r.code} ({r.name})
              </option>
            ))}
          </select>
        </div>

        {/* Semester Dropdown */}
        <div>
          <label htmlFor="qp-semester-select" className="block text-xs font-medium text-slate-500 mb-1">
            Semester
          </label>
          <select
            id="qp-semester-select"
            value={selectedSem ? selectedSem.toString() : "all"}
            onChange={(e) => handleFilterChange("semester", e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Semesters</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.number.toString()}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Exam Year Dropdown */}
        <div>
          <label htmlFor="qp-year-select" className="block text-xs font-medium text-slate-500 mb-1">
            Exam Year
          </label>
          <select
            id="qp-year-select"
            value={selectedYear ? selectedYear.toString() : "all"}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Exam Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>
      </div>
    </div>
  );
}
