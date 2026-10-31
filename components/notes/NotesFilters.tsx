"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface Department {
  id: string;
  slug: string;
  name: string;
  shortName: string;
}

interface Semester {
  id: string;
  number: number;
  label: string;
}

interface NotesFiltersProps {
  departments: Department[];
  semesters: Semester[];
  selectedDept?: string;
  selectedSem?: number;
  initialQuery?: string;
}

export function NotesFilters({
  departments,
  semesters,
  selectedDept,
  selectedSem,
  initialQuery = "",
}: NotesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQuery);

  useEffect(() => {
    setQ(initialQuery);
  }, [initialQuery]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value.trim()) {
      params.delete(key);
    } else {
      params.set(key, value.trim());
    }
    router.push(`/notes?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("q", q);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Keyword Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <label htmlFor="notes-search-input" className="sr-only">
            Filter by subject code
          </label>
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            id="notes-search-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => updateFilters("q", q)}
            placeholder="Filter by subject code (e.g. CS3251)..."
            className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        {/* Department Dropdown */}
        <div>
          <label htmlFor="notes-dept-select" className="sr-only">
            Department
          </label>
          <select
            id="notes-dept-select"
            value={selectedDept || "all"}
            onChange={(e) => updateFilters("department", e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.slug}>
                {d.shortName} ({d.name})
              </option>
            ))}
          </select>
        </div>

        {/* Semester Dropdown */}
        <div>
          <label htmlFor="notes-sem-select" className="sr-only">
            Semester
          </label>
          <select
            id="notes-sem-select"
            value={selectedSem ? selectedSem.toString() : "all"}
            onChange={(e) => updateFilters("semester", e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Semesters</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.number.toString()}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
