# AU Study Hub 🎓

> **Independent Academic Resource Discovery Platform for Anna University Engineering Students in Tamil Nadu, India.**
>
> ⚠️ **Disclaimer**: AU Study Hub is an independent educational tool. It is **NOT** officially affiliated with, endorsed by, or sponsored by Anna University, Chennai. All syllabus records, subject codes, and curriculum links point to public records published by the university and authorized faculty repositories.

---

## 🌟 Key Features

1. **Search-First Discovery Engine**
   - High-precision search matching on Subject Code (e.g. `CS3251`, `MA3151`, `CS3301`), Course Name, or keyword.
   - Comprehensive multi-faceted filtering: Department, Regulation (`R2017`, `R2021`, `R2023`, `R2025`), Semester (1 to 8), Resource Type, and Exam Year/Session.
   - Instant search suggestions with zero hallucinated data.

2. **Previous Year Question Papers**
   - Browse hierarchy: Department → Regulation → Semester → Subject → Exam Year/Session.
   - Distinct tags for `Apr/May` and `Nov/Dec` examination sessions, Regular vs Arrear papers.

3. **Curated Subject Notes**
   - Unit-wise study handouts, formula sheets, and solved university question banks.
   - Original source attribution to faculty authors, NPTEL course mappings, and academic consortiums.

4. **Official Anna University Syllabus**
   - Direct citations to official curriculum circulars from Centre for Academic Courses (CAC), Anna University.
   - Clear visual status badges: Official Document vs Verified Academic Material vs Pending Review.

5. **Student Hub & Dashboard**
   - No forced account creation or paywalls.
   - Save bookmarks locally and across sessions.
   - Customize quick-access jump shortcuts to your specific branch and semester.

6. **Full-Featured Admin Management**
   - Add, edit, verify, publish, or unpublish academic resources.
   - Direct PDF file upload validation (strict MIME checks, 25MB cap, sanitized storage hashes).
   - Review and resolve student-reported broken links or catalog discrepancies.

---

## 🏗️ Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **UI & Styling**: React 19, Tailwind CSS, Lucide Icons, Radix UI Primitives
- **Language**: TypeScript (Strict Mode)
- **Database & ORM**: SQLite (Local Zero-Config Dev) / PostgreSQL (Production) with Prisma ORM
- **Validation**: Zod (Runtime input validation for search, uploads, and reports)
- **SEO & Performance**: Dynamic XML Sitemap, Robots.txt, OpenGraph metadata, JSON-LD structured data

---

## 📁 Project Structure

```
au-study-hub/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Production homepage with HeroSearch & Dept shortcuts
│   │   ├── question-papers/page.tsx    # Question papers catalog
│   │   ├── notes/page.tsx              # Subject study handouts
│   │   ├── syllabus/page.tsx           # Official CAC curriculum syllabi
│   │   ├── departments/                # Engineering branch index
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── search/page.tsx             # Smart search interface
│   │   └── resources/[id]/page.tsx     # Resource detail with in-browser PDF previewer
│   ├── dashboard/page.tsx              # Student personal bookmark space
│   ├── admin/page.tsx                  # Secure administrative resource & report management
│   ├── api/
│   │   ├── departments/route.ts
│   │   ├── regulations/route.ts
│   │   ├── semesters/route.ts
│   │   ├── subjects/route.ts
│   │   ├── search/route.ts
│   │   ├── resources/
│   │   ├── reports/route.ts
│   │   ├── bookmarks/
│   │   └── admin/
│   ├── layout.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/                         # Navbar with disclaimer badge & comprehensive Footer
│   ├── search/                         # HeroSearch & SearchClient with live filters
│   ├── resources/                      # ResourceCard & ResourceDetailClient (preview, download, report)
│   ├── dashboard/                      # DashboardClient
│   └── admin/                          # AdminDashboardClient
├── lib/
│   ├── db.ts                           # Prisma singleton client
│   ├── validation.ts                   # Zod schemas
│   └── utils.ts                        # Formatters, byte calculation, badge palettes
├── prisma/
│   ├── schema.prisma                   # Production relational schema
│   ├── seed.js                         # Authentic Anna University curriculum seed data
│   └── dev.db                          # SQLite database
├── tests/
│   └── verify-hub.js                   # Automated 13-point test suite
├── package.json
└── README.md
```

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- Node.js 18+ (tested on Node v24.x)
- npm or pnpm

### 2. Installation
```bash
# Clone and enter directory
cd au-study-hub

# Install dependencies
npm install
```

### 3. Initialize Database & Seed
```bash
# Push Prisma schema to local database
npm run prisma:push

# Seed authentic Anna University curriculum data
npm run prisma:seed
```

### 4. Run Automated Verification Test Suite
```bash
node tests/verify-hub.js
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Compliance
- **Parameterization**: All SQL queries run through Prisma parameterized bindings to prevent SQL injections.
- **Strict PDF Restrictions**: File uploads validate genuine PDF MIME signatures and limit files to 25MB max with cryptographic filenames.
- **Security Headers**: HSTS, X-Content-Type-Options: `nosniff`, X-Frame-Options: `DENY`, and Referrer-Policy configured in `next.config.ts`.
- **Public DMCA / Takedown Channel**: Dedicated reporting pipeline on every resource page for immediate faculty copyright review.
