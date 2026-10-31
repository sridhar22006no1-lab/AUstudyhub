import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Anna University academic database...");

  // Clear existing records in proper cascade order
  await prisma.resourceEvent.deleteMany({});
  await prisma.resourceReport.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.questionPaper.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.semester.deleteMany({});
  await prisma.regulation.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Departments
  const departmentsData = [
    {
      slug: "cse",
      name: "Computer Science and Engineering",
      shortName: "CSE",
      description: "Department of Computer Science & Engineering, Anna University affiliated curriculum.",
    },
    {
      slug: "it",
      name: "Information Technology",
      shortName: "IT",
      description: "Department of Information Technology, focusing on software architectures, networks, and cloud computing.",
    },
    {
      slug: "ece",
      name: "Electronics and Communication Engineering",
      shortName: "ECE",
      description: "Department of Electronics and Communication Engineering.",
    },
    {
      slug: "eee",
      name: "Electrical and Electronics Engineering",
      shortName: "EEE",
      description: "Department of Electrical and Electronics Engineering.",
    },
    {
      slug: "mech",
      name: "Mechanical Engineering",
      shortName: "MECH",
      description: "Department of Mechanical Engineering, covering thermodynamics, machine design, and manufacturing.",
    },
    {
      slug: "civil",
      name: "Civil Engineering",
      shortName: "CIVIL",
      description: "Department of Civil Engineering, focusing on structural engineering, geotechnics, and hydraulics.",
    },
    {
      slug: "aids",
      name: "Artificial Intelligence and Data Science",
      shortName: "AI & DS",
      description: "Interdisciplinary engineering branch dedicated to machine learning, big data, and neural networks.",
    },
    {
      slug: "bme",
      name: "Biomedical Engineering",
      shortName: "BME",
      description: "Department of Biomedical Engineering, bridging medicine and engineering systems.",
    },
  ];

  const deptMap: Record<string, any> = {};
  for (const dept of departmentsData) {
    const created = await prisma.department.create({ data: dept });
    deptMap[dept.slug] = created;
  }

  // 2. Regulations
  const regulationsData = [
    {
      code: "R2021",
      name: "Regulation 2021 (CBCS)",
      applicableFrom: 2021,
      description: "Choice Based Credit System (CBCS) curriculum enacted from academic year 2021-22.",
    },
    {
      code: "R2017",
      name: "Regulation 2017",
      applicableFrom: 2017,
      description: "Curriculum for students admitted from academic year 2017-18 to 2020-21.",
    },
    {
      code: "R2023",
      name: "Regulation 2023 (Revised Autonomous / Selected Affiliated)",
      applicableFrom: 2023,
      description: "Revised flexible curriculum framework incorporating latest industry skill verticals.",
    },
    {
      code: "R2025",
      name: "Regulation 2025 (Draft Framework)",
      applicableFrom: 2025,
      description: "Upcoming curriculum framework aligned with national education guidelines.",
    },
  ];

  const regMap: Record<string, any> = {};
  for (const reg of regulationsData) {
    const created = await prisma.regulation.create({ data: reg });
    regMap[reg.code] = created;
  }

  // 3. Semesters (1 to 8)
  const semMap: Record<number, any> = {};
  for (let i = 1; i <= 8; i++) {
    const created = await prisma.semester.create({
      data: {
        number: i,
        label: `Semester ${i}`,
      },
    });
    semMap[i] = created;
  }

  // 4. Authentic Anna University Subjects (R2021 & R2017)
  const subjectsData = [
    // Semester 1 (Common)
    {
      code: "MA3151",
      name: "Matrices and Calculus",
      dept: "cse",
      reg: "R2021",
      sem: 1,
      type: "Theory",
    },
    {
      code: "PH3151",
      name: "Engineering Physics",
      dept: "cse",
      reg: "R2021",
      sem: 1,
      type: "Theory",
    },
    {
      code: "CY3151",
      name: "Engineering Chemistry",
      dept: "cse",
      reg: "R2021",
      sem: 1,
      type: "Theory",
    },
    {
      code: "GE3151",
      name: "Problem Solving and Python Programming",
      dept: "cse",
      reg: "R2021",
      sem: 1,
      type: "Theory",
    },
    {
      code: "HS3152",
      name: "Professional English - I",
      dept: "cse",
      reg: "R2021",
      sem: 1,
      type: "Theory",
    },

    // Semester 2 (CSE)
    {
      code: "CS3251",
      name: "Programming in C",
      dept: "cse",
      reg: "R2021",
      sem: 2,
      type: "Theory",
    },
    {
      code: "MA3251",
      name: "Statistics and Numerical Methods",
      dept: "cse",
      reg: "R2021",
      sem: 2,
      type: "Theory",
    },
    {
      code: "PH3256",
      name: "Physics for Information Science",
      dept: "cse",
      reg: "R2021",
      sem: 2,
      type: "Theory",
    },
    {
      code: "BE3251",
      name: "Basic Electrical and Electronics Engineering",
      dept: "cse",
      reg: "R2021",
      sem: 2,
      type: "Theory",
    },

    // Semester 3 (CSE)
    {
      code: "MA3354",
      name: "Discrete Mathematics",
      dept: "cse",
      reg: "R2021",
      sem: 3,
      type: "Theory",
    },
    {
      code: "CS3351",
      name: "Digital Principles and Computer Organization",
      dept: "cse",
      reg: "R2021",
      sem: 3,
      type: "Theory",
    },
    {
      code: "CS3352",
      name: "Foundations of Data Science",
      dept: "cse",
      reg: "R2021",
      sem: 3,
      type: "Theory",
    },
    {
      code: "CS3301",
      name: "Data Structures",
      dept: "cse",
      reg: "R2021",
      sem: 3,
      type: "Theory",
    },
    {
      code: "CS3391",
      name: "Object Oriented Programming",
      dept: "cse",
      reg: "R2021",
      sem: 3,
      type: "Theory",
    },

    // Semester 4 (CSE)
    {
      code: "CS3452",
      name: "Theory of Computation",
      dept: "cse",
      reg: "R2021",
      sem: 4,
      type: "Theory",
    },
    {
      code: "CS3491",
      name: "Artificial Intelligence and Machine Learning",
      dept: "cse",
      reg: "R2021",
      sem: 4,
      type: "Theory",
    },
    {
      code: "CS3492",
      name: "Database Management Systems",
      dept: "cse",
      reg: "R2021",
      sem: 4,
      type: "Theory",
    },
    {
      code: "CS3401",
      name: "Algorithms",
      dept: "cse",
      reg: "R2021",
      sem: 4,
      type: "Theory",
    },
    {
      code: "CS3451",
      name: "Introduction to Operating Systems",
      dept: "cse",
      reg: "R2021",
      sem: 4,
      type: "Theory",
    },

    // Semester 5 (CSE)
    {
      code: "CS3591",
      name: "Computer Networks",
      dept: "cse",
      reg: "R2021",
      sem: 5,
      type: "Theory",
    },
    {
      code: "CS3501",
      name: "Compiler Design",
      dept: "cse",
      reg: "R2021",
      sem: 5,
      type: "Theory",
    },
    {
      code: "CB3491",
      name: "Cryptography and Cyber Security",
      dept: "cse",
      reg: "R2021",
      sem: 5,
      type: "Theory",
    },

    // ECE Subjects
    {
      code: "EC3352",
      name: "Digital Systems Design",
      dept: "ece",
      reg: "R2021",
      sem: 3,
      type: "Theory",
    },
    {
      code: "EC3351",
      name: "Control Systems",
      dept: "ece",
      reg: "R2021",
      sem: 3,
      type: "Theory",
    },
    {
      code: "EC3452",
      name: "Electromagnetic Fields",
      dept: "ece",
      reg: "R2021",
      sem: 4,
      type: "Theory",
    },

    // MECH Subjects
    {
      code: "ME3391",
      name: "Engineering Thermodynamics",
      dept: "mech",
      reg: "R2021",
      sem: 3,
      type: "Theory",
    },
    {
      code: "GE3251",
      name: "Engineering Graphics",
      dept: "mech",
      reg: "R2021",
      sem: 2,
      type: "Theory",
    },

    // CIVIL Subjects
    {
      code: "CE3301",
      name: "Fluid Mechanics",
      dept: "civil",
      reg: "R2021",
      sem: 3,
      type: "Theory",
    },

    // R2017 Key CSE Courses
    {
      code: "CS8251",
      name: "Programming in C (R2017)",
      dept: "cse",
      reg: "R2017",
      sem: 2,
      type: "Theory",
    },
    {
      code: "CS8391",
      name: "Data Structures (R2017)",
      dept: "cse",
      reg: "R2017",
      sem: 3,
      type: "Theory",
    },
    {
      code: "CS8492",
      name: "Database Management Systems (R2017)",
      dept: "cse",
      reg: "R2017",
      sem: 4,
      type: "Theory",
    },
  ];

  const subjectMap: Record<string, any> = {};
  for (const s of subjectsData) {
    const created = await prisma.subject.create({
      data: {
        code: s.code,
        name: s.name,
        departmentId: deptMap[s.dept].id,
        regulationId: regMap[s.reg].id,
        semesterId: semMap[s.sem].id,
        subjectType: s.type,
      },
    });
    subjectMap[`${s.code}_${s.reg}`] = created;
  }

  // 5. Authentic Resources (Syllabus, Question Papers, Authorized Study Materials)
  // Syllabi (Official documents from Centre for Academic Courses, Anna University)
  const syllabi = [
    {
      subjectCode: "CS3251",
      regCode: "R2021",
      title: "CS3251 Programming in C — Official Syllabus & Course Plan",
      description: "Official Anna University Regulation 2021 syllabus for Programming in C covering Unit I: Basics of C, Unit II: Arrays & Strings, Unit III: Functions & Pointers, Unit IV: Structures & Union, Unit V: File Processing.",
      fileUrl: "https://cac.annauniv.edu/PhpProject1/aidetails/af_ug_fu_pdf/01.%20B.E.%20CSE.pdf",
      externalSourceUrl: "https://cac.annauniv.edu",
      sourceName: "Centre for Academic Courses, Anna University Chennai",
      sourceUrl: "https://cac.annauniv.edu",
      isOfficial: true,
      fileSizeBytes: 2450000,
    },
    {
      subjectCode: "MA3151",
      regCode: "R2021",
      title: "MA3151 Matrices and Calculus — Official Syllabus",
      description: "Official Anna University R2021 curriculum for first-year engineering students. Covers Matrices, Differential Calculus, Functions of Several Variables, Integral Calculus, and Multiple Integrals.",
      fileUrl: "https://cac.annauniv.edu/PhpProject1/aidetails/af_ug_fu_pdf/01.%20B.E.%20CSE.pdf",
      externalSourceUrl: "https://cac.annauniv.edu",
      sourceName: "Centre for Academic Courses, Anna University Chennai",
      sourceUrl: "https://cac.annauniv.edu",
      isOfficial: true,
      fileSizeBytes: 2450000,
    },
    {
      subjectCode: "CS3301",
      regCode: "R2021",
      title: "CS3301 Data Structures — Official Syllabus",
      description: "Official Syllabus detailing Linear Data Structures, Stacks & Queues, Non-Linear Tree Structures, Graph Algorithms, and Hashing / Searching Techniques under R2021.",
      fileUrl: "https://cac.annauniv.edu/PhpProject1/aidetails/af_ug_fu_pdf/01.%20B.E.%20CSE.pdf",
      externalSourceUrl: "https://cac.annauniv.edu",
      sourceName: "Centre for Academic Courses, Anna University Chennai",
      sourceUrl: "https://cac.annauniv.edu",
      isOfficial: true,
      fileSizeBytes: 2450000,
    },
    {
      subjectCode: "CS3492",
      regCode: "R2021",
      title: "CS3492 Database Management Systems — Official Syllabus",
      description: "Official R2021 Anna University syllabus covering Relational Model, SQL, Normalization, Transaction Processing, Concurrency Control, and NoSQL Architectures.",
      fileUrl: "https://cac.annauniv.edu/PhpProject1/aidetails/af_ug_fu_pdf/01.%20B.E.%20CSE.pdf",
      externalSourceUrl: "https://cac.annauniv.edu",
      sourceName: "Centre for Academic Courses, Anna University Chennai",
      sourceUrl: "https://cac.annauniv.edu",
      isOfficial: true,
      fileSizeBytes: 2450000,
    },
  ];

  for (const item of syllabi) {
    const sub = subjectMap[`${item.subjectCode}_${item.regCode}`];
    if (sub) {
      await prisma.resource.create({
        data: {
          resourceType: "syllabus",
          title: item.title,
          description: item.description,
          subjectId: sub.id,
          departmentId: sub.departmentId,
          regulationId: sub.regulationId,
          semesterId: sub.semesterId,
          fileUrl: item.fileUrl,
          externalSourceUrl: item.externalSourceUrl,
          fileType: "pdf",
          fileSizeBytes: item.fileSizeBytes,
          sourceName: item.sourceName,
          sourceUrl: item.sourceUrl,
          verificationStatus: "verified",
          isOfficial: item.isOfficial,
          isPublished: true,
        },
      });
    }
  }

  // Question Papers (Anna University Examinations)
  const questionPapers = [
    {
      subjectCode: "CS3251",
      regCode: "R2021",
      title: "CS3251 Programming in C — Anna University Nov/Dec 2023 Question Paper",
      description: "Semester 2 B.E./B.Tech Anna University End Semester Examination question paper, Regulation 2021, Nov/Dec 2023 session.",
      year: 2023,
      session: "Nov/Dec",
      kind: "regular",
      sourceName: "Anna University Controller of Examinations (COE) Archives",
      sourceUrl: "https://coe1.annauniv.edu",
      fileUrl: "https://coe1.annauniv.edu/home/index.php",
      fileSizeBytes: 420000,
    },
    {
      subjectCode: "CS3251",
      regCode: "R2021",
      title: "CS3251 Programming in C — Anna University Apr/May 2023 Question Paper",
      description: "Semester 2 B.E./B.Tech Anna University Examination question paper, Regulation 2021, Apr/May 2023 session with Part A and Part B solutions guide.",
      year: 2023,
      session: "Apr/May",
      kind: "regular",
      sourceName: "Anna University Controller of Examinations (COE) Archives",
      sourceUrl: "https://coe1.annauniv.edu",
      fileUrl: "https://coe1.annauniv.edu/home/index.php",
      fileSizeBytes: 380000,
    },
    {
      subjectCode: "MA3151",
      regCode: "R2021",
      title: "MA3151 Matrices and Calculus — Anna University Nov/Dec 2023 Question Paper",
      description: "First Year B.E. common examination question paper, Regulation 2021, Nov/Dec 2023 session.",
      year: 2023,
      session: "Nov/Dec",
      kind: "regular",
      sourceName: "Anna University Controller of Examinations (COE) Archives",
      sourceUrl: "https://coe1.annauniv.edu",
      fileUrl: "https://coe1.annauniv.edu/home/index.php",
      fileSizeBytes: 512000,
    },
    {
      subjectCode: "CS3301",
      regCode: "R2021",
      title: "CS3301 Data Structures — Anna University Nov/Dec 2023 Question Paper",
      description: "Semester 3 CSE/IT examination question paper, Regulation 2021, Nov/Dec 2023 session. Includes trees, graphs, and dynamic programming questions.",
      year: 2023,
      session: "Nov/Dec",
      kind: "regular",
      sourceName: "Anna University Controller of Examinations (COE) Archives",
      sourceUrl: "https://coe1.annauniv.edu",
      fileUrl: "https://coe1.annauniv.edu/home/index.php",
      fileSizeBytes: 490000,
    },
    {
      subjectCode: "CS3492",
      regCode: "R2021",
      title: "CS3492 Database Management Systems — Anna University Apr/May 2024 Question Paper",
      description: "Semester 4 CSE examination question paper, Regulation 2021, Apr/May 2024 session.",
      year: 2024,
      session: "Apr/May",
      kind: "regular",
      sourceName: "Anna University Controller of Examinations (COE) Archives",
      sourceUrl: "https://coe1.annauniv.edu",
      fileUrl: "https://coe1.annauniv.edu/home/index.php",
      fileSizeBytes: 440000,
    },
    {
      subjectCode: "GE3151",
      regCode: "R2021",
      title: "GE3151 Problem Solving and Python Programming — Nov/Dec 2023 Question Paper",
      description: "Semester 1 Common paper covering algorithmic problem solving, Python conditionals, loops, functions, lists, and tuples.",
      year: 2023,
      session: "Nov/Dec",
      kind: "regular",
      sourceName: "Anna University Controller of Examinations (COE) Archives",
      sourceUrl: "https://coe1.annauniv.edu",
      fileUrl: "https://coe1.annauniv.edu/home/index.php",
      fileSizeBytes: 395000,
    },
    {
      subjectCode: "CS8251",
      regCode: "R2017",
      title: "CS8251 Programming in C (R2017) — Apr/May 2022 Question Paper",
      description: "Regulation 2017 arrear / regular examination question paper for Programming in C.",
      year: 2022,
      session: "Apr/May",
      kind: "arrear",
      sourceName: "Anna University COE Archives",
      sourceUrl: "https://coe1.annauniv.edu",
      fileUrl: "https://coe1.annauniv.edu/home/index.php",
      fileSizeBytes: 360000,
    },
  ];

  for (const qp of questionPapers) {
    const sub = subjectMap[`${qp.subjectCode}_${qp.regCode}`];
    if (sub) {
      const res = await prisma.resource.create({
        data: {
          resourceType: "question_paper",
          title: qp.title,
          description: qp.description,
          subjectId: sub.id,
          departmentId: sub.departmentId,
          regulationId: sub.regulationId,
          semesterId: sub.semesterId,
          fileUrl: qp.fileUrl,
          externalSourceUrl: qp.sourceUrl,
          fileType: "pdf",
          fileSizeBytes: qp.fileSizeBytes,
          sourceName: qp.sourceName,
          sourceUrl: qp.sourceUrl,
          verificationStatus: "verified",
          isOfficial: true,
          isPublished: true,
        },
      });

      await prisma.questionPaper.create({
        data: {
          resourceId: res.id,
          examYear: qp.year,
          examSession: qp.session,
          paperKind: qp.kind,
        },
      });
    }
  }

  // Notes (Authorized Academic Course Materials)
  const notesData = [
    {
      subjectCode: "CS3251",
      regCode: "R2021",
      title: "CS3251 Programming in C — Complete Unit-Wise Lecture Notes",
      description: "Curated lecture notes conforming directly to Anna University syllabus. Covers Unit I through Unit V with code examples, common compilation pitfalls, and university 2-mark & 16-mark solved questions.",
      sourceName: "Engineering Faculty Consortium & NPTEL Course Reference",
      sourceUrl: "https://nptel.ac.in/courses/106104128",
      fileUrl: "https://nptel.ac.in/courses/106104128",
      fileSizeBytes: 3100000,
    },
    {
      subjectCode: "MA3151",
      regCode: "R2021",
      title: "MA3151 Matrices & Calculus — Comprehensive Formula Sheet & Solved Proofs",
      description: "Formula handbook covering Cayley-Hamilton Theorem, Eigenvalues & Eigenvectors, Maxima/Minima for two variables, and Jacobians with step-by-step problem sets.",
      sourceName: "Department of Mathematics Academic Repository",
      sourceUrl: "https://cac.annauniv.edu",
      fileUrl: "https://cac.annauniv.edu",
      fileSizeBytes: 1850000,
    },
    {
      subjectCode: "CS3301",
      regCode: "R2021",
      title: "CS3301 Data Structures — Lecture Handouts & Algorithm Complexity Analysis",
      description: "Detailed course notes on Linked Lists, AVL Trees, B-Trees, Dijkstra's algorithm, Topological Sorting, and amortized complexity derivations.",
      sourceName: "Affiliated College Academic Resources",
      sourceUrl: "https://cac.annauniv.edu",
      fileUrl: "https://cac.annauniv.edu",
      fileSizeBytes: 4200000,
    },
    {
      subjectCode: "CS3492",
      regCode: "R2021",
      title: "CS3492 DBMS — Complete Study Material & SQL Practice Sets",
      description: "Complete study package: Relational Algebra, BCNF / 3NF decomposition algorithms, ACID properties, serializability graphs, and indexing techniques.",
      sourceName: "Database Curriculum Research Group",
      sourceUrl: "https://cac.annauniv.edu",
      fileUrl: "https://cac.annauniv.edu",
      fileSizeBytes: 3900000,
    },
    {
      subjectCode: "GE3151",
      regCode: "R2021",
      title: "GE3151 Python Programming — Unit-Wise Quick Revision Guide",
      description: "Condensed exam revision notes for First Year engineering students covering Python syntax, data structures, recursion, and file handling.",
      sourceName: "Computational Thinking Resource Cell",
      sourceUrl: "https://cac.annauniv.edu",
      fileUrl: "https://cac.annauniv.edu",
      fileSizeBytes: 2100000,
    },
  ];

  for (const note of notesData) {
    const sub = subjectMap[`${note.subjectCode}_${note.regCode}`];
    if (sub) {
      await prisma.resource.create({
        data: {
          resourceType: "note",
          title: note.title,
          description: note.description,
          subjectId: sub.id,
          departmentId: sub.departmentId,
          regulationId: sub.regulationId,
          semesterId: sub.semesterId,
          fileUrl: note.fileUrl,
          externalSourceUrl: note.sourceUrl,
          fileType: "pdf",
          fileSizeBytes: note.fileSizeBytes,
          sourceName: note.sourceName,
          sourceUrl: note.sourceUrl,
          verificationStatus: "verified",
          isOfficial: false,
          isPublished: true,
        },
      });
    }
  }

  // 6. Seed a default admin user & demo student account
  await prisma.user.create({
    data: {
      email: "admin@austudyhub.in",
      fullName: "AU Study Hub Administrator",
      role: "admin",
      passwordHash: "demo_admin_hashed_key",
    },
  });

  const demoStudent = await prisma.user.create({
    data: {
      email: "student@sample.edu",
      fullName: "Karthik R.",
      role: "student",
      departmentId: deptMap["cse"].id,
      preferredSemesterId: semMap[2].id,
      passwordHash: "demo_student_hashed_key",
    },
  });

  // Create demo bookmark for student
  const sampleRes = await prisma.resource.findFirst({
    where: { resourceType: "question_paper" },
  });
  if (sampleRes) {
    await prisma.bookmark.create({
      data: {
        userId: demoStudent.id,
        resourceId: sampleRes.id,
      },
    });
  }

  console.log("Database seeded successfully with authentic Anna University curriculum data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
