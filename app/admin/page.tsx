import { db } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata = {
  title: "Admin Dashboard — AU Study Hub",
  description: "Administrative console for managing curriculum, verifying question papers, and resolving student reports.",
};

export const revalidate = 0; // Dynamic admin view

export default async function AdminPage() {
  const [
    totalResources,
    totalQuestionPapers,
    totalNotes,
    totalSyllabus,
    openReports,
    totalEvents,
    initialResources,
    initialReports,
    subjects,
    departments,
    regulations,
  ] = await Promise.all([
    db.resource.count(),
    db.resource.count({ where: { resourceType: "question_paper" } }),
    db.resource.count({ where: { resourceType: "note" } }),
    db.resource.count({ where: { resourceType: "syllabus" } }),
    db.resourceReport.count({ where: { status: "open" } }),
    db.resourceEvent.count(),
    db.resource.findMany({
      include: {
        subject: true,
        department: true,
        regulation: true,
        semester: true,
        questionPaper: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.resourceReport.findMany({
      include: {
        resource: {
          include: {
            subject: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.subject.findMany({
      include: {
        department: true,
        regulation: true,
        semester: true,
      },
      orderBy: [{ code: "asc" }],
    }),
    db.department.findMany({ where: { isActive: true }, orderBy: { shortName: "asc" } }),
    db.regulation.findMany({ where: { isActive: true }, orderBy: { applicableFrom: "desc" } }),
  ]);

  const stats = {
    totalResources,
    totalQuestionPapers,
    totalNotes,
    totalSyllabus,
    openReports,
    totalEvents,
  };

  return (
    <AdminDashboardClient
      stats={stats}
      initialResources={initialResources}
      initialReports={initialReports}
      subjects={subjects}
      departments={departments}
      regulations={regulations}
    />
  );
}
