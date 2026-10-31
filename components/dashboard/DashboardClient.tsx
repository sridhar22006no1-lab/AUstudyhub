"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Clock,
  Download,
  Building2,
  Calendar,
  FileText,
  BookOpen,
  Layers,
  ArrowRight,
  Trash2,
  Sparkles,
} from "lucide-react";
import { ResourceCard, ResourceCardProps } from "@/components/resources/ResourceCard";

interface Department {
  id: string;
  slug: string;
  name: string;
  shortName: string;
}

interface DashboardClientProps {
  departments: Department[];
  initialBookmarks: any[];
}

export function DashboardClient({ departments, initialBookmarks }: DashboardClientProps) {
  const [bookmarks, setBookmarks] = useState<any[]>(initialBookmarks);
  const [preferredDept, setPreferredDept] = useState("cse");
  const [preferredSem, setPreferredSem] = useState(2);
  const [activeTab, setActiveTab] = useState<"bookmarks" | "history">("bookmarks");

  // Load preferences from local storage if available
  useEffect(() => {
    try {
      const savedDept = localStorage.getItem("au_pref_dept");
      const savedSem = localStorage.getItem("au_pref_sem");
      if (savedDept) setPreferredDept(savedDept);
      if (savedSem) setPreferredSem(parseInt(savedSem, 10));
    } catch (e) {}
  }, []);

  const handleDeptChange = (val: string) => {
    setPreferredDept(val);
    try {
      localStorage.setItem("au_pref_dept", val);
    } catch (e) {}
  };

  const handleSemChange = (val: number) => {
    setPreferredSem(val);
    try {
      localStorage.setItem("au_pref_sem", val.toString());
    } catch (e) {}
  };

  const handleRemoveBookmark = async (resourceId: string) => {
    try {
      await fetch(`/api/bookmarks/${resourceId}`, { method: "DELETE" });
      setBookmarks((prev) => prev.filter((b) => b.resource.id !== resourceId));
    } catch (e) {
      console.error(e);
    }
  };

  const selectedDepartment =
    departments.find((d) => d.slug === preferredDept) || departments[0];

  const bookmarkedQuestionPapers = bookmarks.filter(
    (b) => b.resource.resourceType === "question_paper"
  );
  const bookmarkedNotes = bookmarks.filter((b) => b.resource.resourceType === "note");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800 text-cyan-300 text-xs font-semibold mb-3">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Academic Space</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Academic Hub
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
            Manage your saved question papers, lecture materials, and customize quick jump shortcuts to your branch and semester. No forced login required.
          </p>
        </div>

        {/* Quick Customization Controls */}
        <div className="mt-6 pt-4 border-t border-blue-800/80 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-200">My Department:</span>
            <select
              value={preferredDept}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="bg-blue-950 border border-blue-700 text-white font-medium py-1 px-2.5 rounded-lg text-xs"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.shortName} — {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-200">Current Semester:</span>
            <select
              value={preferredSem}
              onChange={(e) => handleSemChange(parseInt(e.target.value, 10))}
              className="bg-blue-950 border border-blue-700 text-white font-medium py-1 px-2.5 rounded-lg text-xs"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Jump Shortcuts Box */}
      {selectedDepartment && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>
                Quick Jump for {selectedDepartment.shortName} (Semester {preferredSem})
              </span>
            </div>
            <span className="text-xs text-slate-400">Personalized</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href={`/question-papers?department=${preferredDept}&semester=${preferredSem}`}
              className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    Question Papers
                  </h4>
                  <p className="text-[11px] text-slate-500">Sem {preferredSem} Papers</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={`/notes?department=${preferredDept}&semester=${preferredSem}`}
              className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                    Study Notes
                  </h4>
                  <p className="text-[11px] text-slate-500">Sem {preferredSem} Handouts</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={`/departments/${preferredDept}?semester=${preferredSem}`}
              className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-purple-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600">
                    Subject Catalog
                  </h4>
                  <p className="text-[11px] text-slate-500">All Course Codes</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Bookmarked Materials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Bookmarked Academic Materials</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {bookmarks.length}
            </span>
          </div>
          <Link href="/search" className="text-xs text-blue-600 hover:underline">
            Find More to Bookmark →
          </Link>
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((b) => (
              <div key={b.id} className="relative group/box">
                <ResourceCard resource={b.resource} />
                <button
                  type="button"
                  onClick={() => handleRemoveBookmark(b.resource.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-xs z-10 transition-colors"
                  title="Remove from saved bookmarks"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No bookmarks saved yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save previous year question papers or unit notes while browsing to access them in one tap before examinations.
            </p>
            <div className="pt-2">
              <Link
                href="/question-papers"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors inline-block"
              >
                Explore Question Papers
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
