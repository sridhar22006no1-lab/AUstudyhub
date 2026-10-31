"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, BookOpen, FileText, Layers, X, Sparkles } from "lucide-react";

interface QuickSuggestion {
  code: string;
  name: string;
  dept: string;
  reg: string;
}

const COMMON_SUGGESTIONS: QuickSuggestion[] = [
  { code: "CS3251", name: "Programming in C", dept: "CSE", reg: "R2021" },
  { code: "MA3151", name: "Matrices and Calculus", dept: "Common", reg: "R2021" },
  { code: "CS3301", name: "Data Structures", dept: "CSE", reg: "R2021" },
  { code: "GE3151", name: "Problem Solving and Python", dept: "Common", reg: "R2021" },
  { code: "CS3492", name: "Database Management Systems", dept: "CSE", reg: "R2021" },
  { code: "CS3351", name: "Digital Principles & Org", dept: "CSE", reg: "R2021" },
];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [regulation, setRegulation] = useState("all");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = query.trim()
    ? COMMON_SUGGESTIONS.filter(
        (s) =>
          s.code.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      )
    : COMMON_SUGGESTIONS.slice(0, 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      router.push("/search");
      return;
    }
    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (regulation !== "all") {
      params.set("regulation", regulation);
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleSelectSuggestion = (item: QuickSuggestion) => {
    router.push(`/search?q=${encodeURIComponent(item.code)}&regulation=${item.reg}`);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto relative">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col sm:flex-row items-stretch bg-white rounded-2xl shadow-xl shadow-blue-900/5 border-2 border-slate-200 hover:border-blue-400 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all p-1.5 gap-2"
      >
        {/* Regulation selector pill */}
        <div className="relative sm:border-r border-slate-200 pr-1 pl-2 flex items-center shrink-0">
          <label htmlFor="hero-regulation" className="sr-only">
            Select Regulation
          </label>
          <select
            id="hero-regulation"
            value={regulation}
            onChange={(e) => setRegulation(e.target.value)}
            className="w-full sm:w-auto bg-transparent py-2.5 px-2 text-xs font-semibold text-slate-700 rounded-lg focus:outline-none cursor-pointer hover:text-blue-600"
          >
            <option value="all">All Regulations</option>
            <option value="R2021">R2021 (Current)</option>
            <option value="R2017">R2017</option>
            <option value="R2023">R2023</option>
            <option value="R2025">R2025</option>
          </select>
        </div>

        {/* Search input */}
        <div className="flex-1 flex items-center relative px-2">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search by subject code (e.g. CS3251) or subject name..."
            className="w-full py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            aria-label="Search subject name or code"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>Find Resources</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Instant Autocomplete Suggestions Dropdown */}
      {isFocused && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-semibold text-slate-500 px-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {query.trim() ? "Matching Subjects" : "Popular Engineering Subjects"}
            </span>
            <span>Anna University Curriculum</span>
          </div>

          <div className="space-y-1">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item) => (
                <button
                  key={`${item.code}-${item.reg}`}
                  type="button"
                  onMouseDown={() => handleSelectSuggestion(item)}
                  className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {item.code}
                    </span>
                    <span className="text-sm font-medium text-slate-800 group-hover:text-blue-600">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{item.dept}</span>
                    <span>•</span>
                    <span className="text-slate-600 font-medium">{item.reg}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-slate-500">
                Press Enter to run full academic search for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Subject Chips */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
        <span className="font-medium text-slate-400">Quick search:</span>
        {["CS3251", "MA3151", "CS3301", "CS3492", "GE3151"].map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => router.push(`/search?q=${code}`)}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors font-mono font-medium text-slate-700"
          >
            {code}
          </button>
        ))}
      </div>
    </div>
  );
}
