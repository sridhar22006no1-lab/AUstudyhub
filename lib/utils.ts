import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes?: number | null, decimals = 1): string {
  if (!bytes || bytes === 0) return "Unknown size";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function getResourceTypeLabel(type: string): string {
  switch (type) {
    case "question_paper":
      return "Question Paper";
    case "note":
      return "Study Note";
    case "syllabus":
      return "Official Syllabus";
    default:
      return type;
  }
}

export function getResourceTypeBadgeColor(type: string): { bg: string; text: string; border: string } {
  switch (type) {
    case "question_paper":
      return {
        bg: "bg-blue-50 text-blue-800 border-blue-200",
        text: "text-blue-700",
        border: "border-blue-300",
      };
    case "note":
      return {
        bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        text: "text-emerald-700",
        border: "border-emerald-300",
      };
    case "syllabus":
      return {
        bg: "bg-purple-50 text-purple-800 border-purple-200",
        text: "text-purple-700",
        border: "border-purple-300",
      };
    default:
      return {
        bg: "bg-slate-50 text-slate-800 border-slate-200",
        text: "text-slate-700",
        border: "border-slate-300",
      };
  }
}
