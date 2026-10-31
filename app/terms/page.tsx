export const metadata = {
  title: "Terms of Use — AU Study Hub",
  description: "Terms of use and academic conduct guidelines for AU Study Hub.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pb-4 border-b border-slate-100">
          Terms of Use
        </h1>
        <div className="text-sm leading-relaxed text-slate-700 space-y-4">
          <p>
            Welcome to AU Study Hub. By accessing or using this website, you agree to comply with and be bound by the following terms.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">1. Educational Use Only</h2>
          <p>
            All content provided on this platform is for non-commercial, personal study, revision, and academic reference only. Users must not scrape, mirror, or repackage platform content for commercial sale or deceptive practices.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">2. Respect for Examination Rules</h2>
          <p>
            AU Study Hub publishes historical, concluded university examination papers for study revision. We strictly prohibit the solicitation, sharing, or distribution of live examination papers or cheating materials.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">3. Disclaimers</h2>
          <p>
            While every effort is made to maintain accurate syllabus codes and question papers, students should verify their specific university scheme with their respective college HOD and official Anna University circulars.
          </p>
        </div>
      </div>
    </div>
  );
}
