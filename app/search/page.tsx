import { Suspense } from "react";
import { db } from "@/lib/db";
import { SearchClient } from "@/components/search/SearchClient";

export const metadata = {
  title: "Smart Academic Search — AU Study Hub",
  description:
    "Search Anna University past question papers, notes, and official syllabi by subject code, name, department, regulation, and semester.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const department = typeof params.department === "string" ? params.department : undefined;
  const regulation = typeof params.regulation === "string" ? params.regulation : undefined;
  const semester = typeof params.semester === "string" ? params.semester : undefined;
  const type = typeof params.type === "string" ? params.type : undefined;

  const [departments, regulations] = await Promise.all([
    db.department.findMany({
      where: { isActive: true },
      orderBy: { shortName: "asc" },
    }),
    db.regulation.findMany({
      where: { isActive: true },
      orderBy: { applicableFrom: "desc" },
    }),
  ]);

  // Initial server query
  const where: any = { isPublished: true };
  if (type && type !== "all") where.resourceType = type;
  if (q && q.trim()) {
    where.OR = [
      { subject: { code: { contains: q.trim() } } },
      { subject: { name: { contains: q.trim() } } },
      { title: { contains: q.trim() } },
    ];
  }
  if (department && department !== "all") {
    where.department = {
      OR: [{ slug: department.toLowerCase() }, { shortName: department.toUpperCase() }],
    };
  }
  if (regulation && regulation !== "all") {
    where.regulation = { code: regulation.toUpperCase() };
  }
  if (semester && semester !== "all") {
    const sNum = parseInt(semester, 10);
    if (!isNaN(sNum)) where.semester = { number: sNum };
  }

  const [initialResources, initialTotal] = await Promise.all([
    db.resource.findMany({
      where,
      include: {
        subject: true,
        department: true,
        regulation: true,
        semester: true,
        questionPaper: true,
      },
      orderBy: [{ isOfficial: "desc" }, { createdAt: "desc" }],
      take: 12,
    }),
    db.resource.count({ where }),
  ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
          Loading Academic Search Engine...
        </div>
      }
    >
      <SearchClient
        departments={departments}
        regulations={regulations}
        initialResources={initialResources}
        initialTotal={initialTotal}
      />
    </Suspense>
  );
}
