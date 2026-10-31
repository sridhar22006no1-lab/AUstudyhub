import Link from "next/link";
import { GraduationCap, ShieldAlert, Heart, ExternalLink, Mail, Info } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600">
      {/* Disclaimer Banner Box */}
      <div className="bg-slate-50 border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 text-xs leading-relaxed text-slate-600">
          <div className="p-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">
              Important Legal & Academic Disclaimer
            </p>
            <p className="mt-0.5">
              <strong>AU Study Hub</strong> is an independent academic resource discovery platform developed for engineering students in Tamil Nadu. It is <strong>NOT</strong> officially affiliated with, endorsed by, sponsored by, or connected to Anna University, Chennai. All official syllabi, regulation circulars, and previous year examination documents are public domain or cited directly to authorized university portals (such as{" "}
              <a
                href="https://cac.annauniv.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline inline-flex items-center gap-0.5"
              >
                cac.annauniv.edu <ExternalLink className="w-2.5 h-2.5" />
              </a>{" "}
              and{" "}
              <a
                href="https://coe1.annauniv.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline inline-flex items-center gap-0.5"
              >
                coe1.annauniv.edu <ExternalLink className="w-2.5 h-2.5" />
              </a>
              ). We do not claim ownership of official university materials.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5 text-cyan-300" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                AU<span className="text-blue-600">StudyHub</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Fast, clutter-free academic discovery portal for Anna University engineering students. Search verified question papers, lecture notes, and official syllabus documents across regulations.
            </p>
            <div className="text-xs text-slate-400">
              Supporting Regulations: <span className="text-slate-600 font-medium">R2025, R2023, R2021, R2017</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Academic Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/question-papers" className="hover:text-blue-600 transition-colors">
                  Previous Year Question Papers
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-blue-600 transition-colors">
                  Subject Lecture Notes
                </Link>
              </li>
              <li>
                <Link href="/syllabus" className="hover:text-blue-600 transition-colors">
                  Official Anna Univ Syllabus
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-blue-600 transition-colors">
                  Departments & Branch Catalog
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-blue-600 transition-colors">
                  Smart Subject Code Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Departments */}
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Popular Departments</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/departments/cse" className="hover:text-blue-600 transition-colors">
                  Computer Science (CSE)
                </Link>
              </li>
              <li>
                <Link href="/departments/ece" className="hover:text-blue-600 transition-colors">
                  Electronics & Comm (ECE)
                </Link>
              </li>
              <li>
                <Link href="/departments/it" className="hover:text-blue-600 transition-colors">
                  Information Technology (IT)
                </Link>
              </li>
              <li>
                <Link href="/departments/mech" className="hover:text-blue-600 transition-colors">
                  Mechanical Engineering (MECH)
                </Link>
              </li>
              <li>
                <Link href="/departments/aids" className="hover:text-blue-600 transition-colors">
                  AI & Data Science (AI & DS)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Contact */}
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Trust & Contact</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>support@austudyhub.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                <span>Takedown / Copyright Process</span>
              </li>
              <li className="pt-2">
                <p className="text-xs text-slate-500 leading-normal">
                  Found a broken link or outdated question paper? Use the &quot;Report Issue&quot; button on any resource page for rapid verification.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AU Study Hub. Independent Student Resource Project.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:underline">
              Terms of Use
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="hover:underline">
              Non-Affiliation Notice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
