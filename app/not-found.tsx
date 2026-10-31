import Link from "next/link";
import { GraduationCap, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto">
        <GraduationCap className="w-8 h-8" />
      </div>
      <span className="text-xs uppercase font-mono font-bold tracking-widest text-blue-600">
        404 — Not Found
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
        Resource or Page Not Located
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
        The requested subject code, curriculum document, or page does not exist or has been moved to an updated regulation.
      </p>
      <div className="pt-2 flex items-center justify-center gap-3 text-xs font-semibold">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Smart Search</span>
        </Link>
      </div>
    </div>
  );
}
