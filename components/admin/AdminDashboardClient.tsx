"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  FileText,
  BookOpen,
  Layers,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Eye,
  RefreshCw,
  Building2,
  Lock,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

interface AdminDashboardClientProps {
  stats: {
    totalResources: number;
    totalQuestionPapers: number;
    totalNotes: number;
    totalSyllabus: number;
    openReports: number;
    totalEvents: number;
  };
  initialResources: any[];
  initialReports: any[];
  subjects: any[];
  departments: any[];
  regulations: any[];
}

export function AdminDashboardClient({
  stats,
  initialResources,
  initialReports,
  subjects,
  departments,
  regulations,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"resources" | "reports" | "subjects">("resources");
  const [resources, setResources] = useState<any[]>(initialResources);
  const [reports, setReports] = useState<any[]>(initialReports);
  const [filterQuery, setFilterQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Resource Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    resourceType: "question_paper",
    subjectId: subjects[0]?.id || "",
    sourceName: "Anna University Controller of Examinations",
    sourceUrl: "https://coe1.annauniv.edu",
    externalSourceUrl: "",
    isOfficial: true,
    verificationStatus: "verified",
    examYear: 2024,
    examSession: "Apr/May",
    paperKind: "regular",
  });

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Toggle Verification status
  const handleToggleVerification = async (res: any) => {
    const nextStatus = res.verificationStatus === "verified" ? "unverified" : "verified";
    try {
      const resp = await fetch(`/api/admin/resources/${res.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: nextStatus }),
      });
      if (resp.ok) {
        setResources((prev) =>
          prev.map((item) =>
            item.id === res.id ? { ...item, verificationStatus: nextStatus } : item
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Publish status
  const handleTogglePublish = async (res: any) => {
    const nextPublish = !res.isPublished;
    try {
      const resp = await fetch(`/api/admin/resources/${res.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: nextPublish }),
      });
      if (resp.ok) {
        setResources((prev) =>
          prev.map((item) =>
            item.id === res.id ? { ...item, isPublished: nextPublish } : item
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Resource
  const handleDeleteResource = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this resource?")) return;
    try {
      const resp = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
      if (resp.ok) {
        setResources((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Report Status
  const handleUpdateReportStatus = async (reportId: string, status: string) => {
    try {
      const resp = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (resp.ok) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Add Resource Form Submit
  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      let uploadedFileUrl = "";

      // Handle PDF upload if selected
      if (uploadFile) {
        const uploadData = new FormData();
        uploadData.append("file", uploadFile);

        const uploadRes = await fetch("/api/admin/uploads", {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) {
          throw new Error(uploadJson.error || "File upload failed");
        }
        uploadedFileUrl = uploadJson.data.fileUrl;
      }

      const payload = {
        ...formData,
        fileUrl: uploadedFileUrl || formData.externalSourceUrl || formData.sourceUrl,
      };

      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to create resource");
      }

      setFormSuccess("Resource added and verified successfully!");
      setUploadFile(null);

      // Refresh list
      const updatedListRes = await fetch("/api/resources?limit=50");
      const updatedJson = await updatedListRes.json();
      if (updatedJson.success) {
        setResources(updatedJson.data);
      }

      setTimeout(() => {
        setIsAddModalOpen(false);
        setFormSuccess("");
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredResources = resources.filter((r) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.subject.code.toLowerCase().includes(q) ||
      r.subject.name.toLowerCase().includes(q) ||
      r.resourceType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-cyan-400 text-xs font-semibold mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Authorized Administrator Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Academic Operations & Resource Control
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Verify question papers, manage curriculum documents, and resolve student-reported link issues.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Academic Resource</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Total Catalog
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 block">
            {stats.totalResources}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Question Papers
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1 block">
            {stats.totalQuestionPapers}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Study Notes
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 block">
            {stats.totalNotes}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Official Syllabi
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-purple-600 mt-1 block">
            {stats.totalSyllabus}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Open Reports
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-rose-600 mt-1 block">
            {stats.openReports}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Total Events
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-700 mt-1 block">
            {stats.totalEvents}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("resources")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "resources"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Manage Resources ({resources.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reports")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "reports"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Issue Reports</span>
          {stats.openReports > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
              {stats.openReports}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("subjects")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "subjects"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Configured Subjects ({subjects.length})
        </button>
      </div>

      {/* TAB 1: Resources Table */}
      {activeTab === "resources" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          {/* Search bar inside admin table */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter by subject code, title..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredResources.length} of {resources.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Resource Title</th>
                  <th className="py-2.5 px-3">Regulation</th>
                  <th className="py-2.5 px-3">Verification</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredResources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mr-1.5">
                        {res.subject.code}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap capitalize">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {res.resourceType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs truncate font-semibold text-slate-900">
                      <Link href={`/resources/${res.id}`} className="hover:text-blue-600">
                        {res.title}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {res.regulation.code}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleVerification(res)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                          res.verificationStatus === "verified"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {res.verificationStatus === "verified" ? "Verified" : "Unverified"}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(res)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                          res.isPublished
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {res.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/resources/${res.id}`}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded"
                          title="View resource page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(res.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete resource permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Reported Issues */}
      {activeTab === "reports" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Student Issue Reports</h3>
            <span className="text-xs text-slate-400">
              Verify broken links or incorrect resource tags
            </span>
          </div>

          {reports.length > 0 ? (
            <div className="divide-y divide-slate-100 space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        {rep.reportType.replace("_", " ")}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        Resource: {rep.resource.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      &ldquo;{rep.message}&rdquo;
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Reported {formatDate(rep.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={rep.status}
                      onChange={(e) => handleUpdateReportStatus(rep.id, e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-slate-800"
                    >
                      <option value="open">Open</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <Link
                      href={`/resources/${rep.resource.id}`}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded bg-slate-100"
                      title="Inspect resource"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500">
              No open reports. All academic resources are verified and healthy!
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Subject Configuration */}
      {activeTab === "subjects" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Registered Anna University Subjects ({subjects.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((s) => (
              <div
                key={s.id}
                className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                      {s.code}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {s.regulation?.code} • {s.semester?.label}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{s.name}</h4>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Branch: {s.department?.shortName}</span>
                  <Link
                    href={`/search?q=${s.code}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add & Verify Academic Resource
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {formSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900">{formSuccess}</h4>
              </div>
            ) : (
              <form onSubmit={handleCreateResource} className="mt-4 space-y-4">
                {formError && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                    {formError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Subject
                    </label>
                    <select
                      value={formData.subjectId}
                      onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.code} — {sub.name} ({sub.regulation?.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Resource Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Resource Category
                    </label>
                    <select
                      value={formData.resourceType}
                      onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                    >
                      <option value="question_paper">Question Paper</option>
                      <option value="note">Subject Notes</option>
                      <option value="syllabus">Official Syllabus</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. CS3251 Programming in C Nov/Dec 2023 Question Paper"
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* If Question paper: Year and session */}
                {formData.resourceType === "question_paper" && (
                  <div className="grid grid-cols-3 gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Exam Year
                      </label>
                      <select
                        value={formData.examYear}
                        onChange={(e) =>
                          setFormData({ ...formData, examYear: parseInt(e.target.value, 10) })
                        }
                        className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5"
                      >
                        <option value={2024}>2024</option>
                        <option value={2023}>2023</option>
                        <option value={2022}>2022</option>
                        <option value={2021}>2021</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Exam Session
                      </label>
                      <select
                        value={formData.examSession}
                        onChange={(e) => setFormData({ ...formData, examSession: e.target.value })}
                        className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5"
                      >
                        <option value="Apr/May">Apr/May</option>
                        <option value="Nov/Dec">Nov/Dec</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Paper Kind
                      </label>
                      <select
                        value={formData.paperKind}
                        onChange={(e) => setFormData({ ...formData, paperKind: e.target.value })}
                        className="w-full text-xs bg-white border border-slate-200 rounded-md p-1.5"
                      >
                        <option value="regular">Regular</option>
                        <option value="arrear">Arrear</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Source attribution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Authorized Source Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sourceName}
                      onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Source Portal URL
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.sourceUrl}
                      onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                    />
                  </div>
                </div>

                {/* Secure PDF Upload or External Link */}
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    File Attachment (PDF Upload or Direct URL)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">
                    Only authentic PDF documents up to 25MB allowed. Files are checked for valid MIME structure.
                  </p>
                </div>

                {/* Verification Checkbox */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isOfficial"
                    checked={formData.isOfficial}
                    onChange={(e) => setFormData({ ...formData, isOfficial: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isOfficial" className="text-xs font-semibold text-slate-700">
                    Mark as Official Anna University document
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                  >
                    {submitting ? "Publishing..." : "Add to Academic Catalog"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
