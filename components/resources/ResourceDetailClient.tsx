"use client";

import { useState } from "react";
import {
  Download,
  ExternalLink,
  Bookmark,
  AlertCircle,
  CheckCircle2,
  FileText,
  X,
  Share2,
  Eye,
} from "lucide-react";

interface ResourceDetailClientProps {
  resourceId: string;
  fileUrl?: string | null;
  externalSourceUrl?: string | null;
  sourceName: string;
  sourceUrl: string;
  initialReportOpen?: boolean;
}

export function ResourceDetailClient({
  resourceId,
  fileUrl,
  externalSourceUrl,
  sourceName,
  sourceUrl,
  initialReportOpen = false,
}: ResourceDetailClientProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(initialReportOpen);
  const [reportType, setReportType] = useState("broken_link");
  const [message, setMessage] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    try {
      if (bookmarked) {
        await fetch(`/api/bookmarks/${resourceId}`, { method: "DELETE" });
        setBookmarked(false);
      } else {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resourceId }),
        });
        setBookmarked(true);
      }
    } catch (e) {
      console.error("Bookmark error", e);
    }
  };

  // Track download
  const handleDownload = async () => {
    try {
      await fetch(`/api/resources/${resourceId}/download`, { method: "POST" });
    } catch (e) {
      // ignore telemetry failure
    }

    const downloadTarget = fileUrl || externalSourceUrl || sourceUrl;
    if (downloadTarget) {
      window.open(downloadTarget, "_blank");
    }
  };

  // Submit Issue Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.length < 10) {
      setReportError("Please describe the issue in at least 10 characters");
      return;
    }
    setReportLoading(true);
    setReportError("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          reportType,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReportSuccess(true);
        setTimeout(() => {
          setReportModalOpen(false);
          setReportSuccess(false);
          setMessage("");
        }, 2000);
      } else {
        setReportError(data.error || "Failed to submit report");
      }
    } catch (err) {
      setReportError("Network error. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {/* Download / Open Action */}
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>

        {/* In-Browser Preview Button */}
        {fileUrl && (
          <button
            type="button"
            onClick={() => setPreviewOpen(!previewOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors border border-slate-300"
          >
            <Eye className="w-4 h-4" />
            <span>{previewOpen ? "Hide Preview" : "Preview PDF"}</span>
          </button>
        )}

        {/* Authorized external source */}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-400 font-semibold text-sm transition-colors"
          >
            <span>Original Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Bookmark button */}
        <button
          type="button"
          onClick={handleToggleBookmark}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
            bookmarked
              ? "bg-amber-50 text-amber-800 border-amber-300"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
          title={bookmarked ? "Remove bookmark" : "Save to bookmarks"}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
          <span>{bookmarked ? "Saved" : "Save"}</span>
        </button>

        {/* Share button */}
        <button
          type="button"
          onClick={handleShare}
          className="p-2.5 rounded-xl bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
          title="Share link"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Report Issue button */}
        <button
          type="button"
          onClick={() => setReportModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Report Issue</span>
        </button>
      </div>

      {copied && (
        <div className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Resource link copied to clipboard!</span>
        </div>
      )}

      {/* Embedded In-Browser PDF Preview Viewer */}
      {previewOpen && fileUrl && (
        <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
          <div className="bg-slate-800 px-4 py-2.5 text-xs text-white flex items-center justify-between border-b border-slate-700">
            <span className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              In-Browser PDF Document Viewer
            </span>
            <button
              onClick={() => setPreviewOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <iframe
            src={fileUrl}
            title="PDF Preview"
            className="w-full h-[600px] bg-white"
          />
        </div>
      )}

      {/* Report Issue Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Report Resource Issue</span>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-900">Thank you for reporting!</h3>
                <p className="text-xs text-slate-500">
                  Our academic verification team will review this file and fix any discrepancies.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Issue Category
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                  >
                    <option value="broken_link">Broken or Inaccessible Link</option>
                    <option value="wrong_subject">Incorrect Subject Code or Semester</option>
                    <option value="copyright">Copyright / Takedown Request</option>
                    <option value="other">Outdated or Low Quality</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description of Issue (min. 10 chars)
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify what is wrong (e.g. Page 3 is missing, link returns 404, or question paper year is mislabeled)..."
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {reportError && (
                  <p className="text-xs text-rose-600 font-medium">{reportError}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportLoading}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50"
                  >
                    {reportLoading ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
