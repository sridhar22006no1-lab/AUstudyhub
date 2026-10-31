import { ShieldAlert, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Non-Affiliation Notice & Academic Disclaimer — AU Study Hub",
  description: "Official non-affiliation notice and academic disclaimer for AU Study Hub.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Non-Affiliation & Academic Disclaimer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Independent Educational Resource Discovery Platform
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4 text-slate-700">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium">
            <strong>AU Study Hub</strong> is an independent academic resource discovery tool created to help engineering students enrolled in Anna University affiliated and autonomous institutions in Tamil Nadu find study materials, past question papers, and syllabus schemes easily.
          </div>

          <h2 className="text-lg font-bold text-slate-900 pt-2">1. No Official Affiliation</h2>
          <p>
            AU Study Hub is <strong>NOT</strong> officially affiliated with, maintained by, endorsed by, or affiliated in any way with Anna University, Chennai, the Directorate of Technical Education (DOTE), or any of its constituent colleges (CEG, MIT, ACT, SAP). We do not claim official status.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">2. Accuracy & Original Sources</h2>
          <p>
            All subject codes (such as CS3251, MA3151), regulation titles (R2017, R2021, R2023, R2025), and curriculum structures are public domain academic identifiers.
          </p>
          <p>
            Whenever possible, AU Study Hub directs students directly to the authorized source:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Centre for Academic Courses (CAC)</strong>:{" "}
              <a
                href="https://cac.annauniv.edu"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline inline-flex items-center gap-1"
              >
                https://cac.annauniv.edu <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <strong>Controller of Examinations (COE)</strong>:{" "}
              <a
                href="https://coe1.annauniv.edu"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline inline-flex items-center gap-1"
              >
                https://coe1.annauniv.edu <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 pt-2">3. Copyright & Takedown Inquiries</h2>
          <p>
            We strictly respect the intellectual property of instructors, educational creators, and institutions. If you are a copyright holder or faculty member and wish for any unauthorized link or material to be removed or updated, please report the resource immediately via the &quot;Report Issue&quot; button on that resource page or contact{" "}
            <span className="font-mono text-blue-600">takedown@austudyhub.in</span>. Requests are verified and acted upon within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
