const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function runTests() {
  console.log("=========================================");
  console.log(" Running AU Study Hub Automated Verification ");
  console.log("=========================================");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✔ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`✘ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  try {
    // Test 1: Departments exist and contain active records
    const depts = await prisma.department.findMany({ where: { isActive: true } });
    assert(depts.length >= 8, `Expected at least 8 active departments, found ${depts.length}`);
    const cse = depts.find((d) => d.slug === "cse");
    assert(!!cse, "CSE department exists with slug 'cse'");

    // Test 2: Regulations exist
    const regs = await prisma.regulation.findMany();
    assert(regs.some((r) => r.code === "R2021"), "Regulation R2021 exists");
    assert(regs.some((r) => r.code === "R2017"), "Regulation R2017 exists");

    // Test 3: Authentic subjects exist
    const cs3251 = await prisma.subject.findFirst({ where: { code: "CS3251" } });
    assert(!!cs3251 && cs3251.name === "Programming in C", "CS3251 exists with correct title");

    const ma3151 = await prisma.subject.findFirst({ where: { code: "MA3151" } });
    assert(!!ma3151 && ma3151.name === "Matrices and Calculus", "MA3151 exists with correct title");

    // Test 4: Resources are classified into question papers, notes, syllabus
    const qps = await prisma.resource.findMany({
      where: { resourceType: "question_paper" },
      include: { questionPaper: true },
    });
    assert(qps.length > 0, `Question papers found: ${qps.length}`);
    assert(qps[0].questionPaper !== null, "Question paper record has exam session and year");

    const notes = await prisma.resource.findMany({ where: { resourceType: "note" } });
    assert(notes.length > 0, `Study notes found: ${notes.length}`);

    const syllabi = await prisma.resource.findMany({ where: { resourceType: "syllabus" } });
    assert(syllabi.length > 0, `Official syllabi found: ${syllabi.length}`);
    assert(syllabi.some((s) => s.isOfficial === true), "Official syllabus has isOfficial flag true");

    // Test 5: Verify search filtering logic
    const searchQuery = "CS3251";
    const searchResults = await prisma.resource.findMany({
      where: {
        isPublished: true,
        OR: [
          { subject: { code: { contains: searchQuery } } },
          { subject: { name: { contains: searchQuery } } },
          { title: { contains: searchQuery } },
        ],
      },
    });
    assert(
      searchResults.length >= 3,
      `Search for '${searchQuery}' returned ${searchResults.length} matching resources (QPs, Notes, Syllabus)`
    );

    // Test 6: Verify issue report creation
    const testReport = await prisma.resourceReport.create({
      data: {
        resourceId: qps[0].id,
        reportType: "broken_link",
        message: "Automated verification test report message.",
        status: "open",
      },
    });
    assert(testReport.status === "open", "Issue report creation verified");

    // Clean up test report
    await prisma.resourceReport.delete({ where: { id: testReport.id } });

    console.log("=========================================");
    console.log(` Summary: ${passed}/${total} checks passed successfully.`);
    console.log("=========================================");
  } catch (error) {
    console.error("Test execution failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
