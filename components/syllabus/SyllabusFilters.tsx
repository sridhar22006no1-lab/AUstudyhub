"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ExternalLink } from "lucide-react";

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

interface SyllabusFiltersProps {
  departments: Department[];
  regulations: Regulation[];
  selectedDept?: string;
  selectedReg?: string;
}

export function SyllabusFilters({
  departments,
  regulations,
  selectedDept,
  selectedReg,
}: SyllabusFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/syllabus?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        {/* Department Dropdown */}
        <select
          aria-label="Filter by department"
          value={selectedDept || "all"}
          onChange={(e) => handleFilterChange("department", e.target.value)}
          className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.slug}>
              {d.shortName} ({d.name})
            </option>
          ))}
        </select>

        {/* Regulation Dropdown */}
        <select
          aria-label="Filter by regulation"
          value={selectedReg || "all"}
          onChange={(e) => handleFilterChange("regulation", e.target.value)}
          className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          <option value="all">All Regulations</option>
          {regulations.map((r) => (
            <option key={r.id} value={r.code}>
              {r.code} ({r.name})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>Official Portal:</span>
        <a
          href="https://cac.annauniv.edu"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
        >
          cac.annauniv.edu <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
