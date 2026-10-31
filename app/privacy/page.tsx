export const metadata = {
  title: "Privacy Policy — AU Study Hub",
  description: "Privacy policy for AU Study Hub users.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pb-4 border-b border-slate-100">
          Privacy Policy
        </h1>
        <div className="text-sm leading-relaxed text-slate-700 space-y-4">
          <p>
            At <strong>AU Study Hub</strong>, student privacy is a core principle. You do not need to register, provide your phone number, or disclose your college identity to browse question papers, study materials, or syllabus documents.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">1. Data We Collect</h2>
          <p>
            - Anonymous usage analytics (e.g. search keywords and resource download counts) to identify popular subjects and keep server performance fast.
          </p>
          <p>
            - Optional student profile preferences (e.g., department and semester) stored locally in browser storage or in optional student bookmarks.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">2. No Third-Party Selling</h2>
          <p>
            We do not sell, rent, or trade student browsing information, email addresses, or usage patterns to third parties or advertising brokers.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">3. Cookies</h2>
          <p>
            We only use functional cookies essential for site operation, bookmark persistence, and session security.
          </p>
        </div>
      </div>
    </div>
  );
}
