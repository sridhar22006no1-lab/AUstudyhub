import { db } from "@/lib/db";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata = {
  title: "Student Academic Dashboard — AU Study Hub",
  description: "Personalized student space for saved question papers, lecture handouts, and fast semester shortcuts.",
};

export default async function DashboardPage() {
  const [departments, initialBookmarks] = await Promise.all([
    db.department.findMany({
      where: { isActive: true },
      orderBy: { shortName: "asc" },
    }),
    db.bookmark.findMany({
      include: {
        resource: {
          include: {
            subject: true,
            department: true,
            regulation: true,
            semester: true,
            questionPaper: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <DashboardClient
      departments={departments}
      initialBookmarks={initialBookmarks}
    />
  );
}
