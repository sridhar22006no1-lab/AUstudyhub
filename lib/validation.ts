import { z } from "zod";

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  department: z.string().optional(),
  regulation: z.string().optional(),
  semester: z.string().optional(),
  type: z.enum(["all", "question_paper", "note", "syllabus"]).optional().default("all"),
  year: z.string().optional(),
  session: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export const reportIssueSchema = z.object({
  resourceId: z.string().min(1, "Resource ID is required"),
  reportType: z.enum(["broken_link", "wrong_subject", "copyright", "other"], {
    errorMap: () => ({ message: "Please select a valid issue type" }),
  }),
  message: z.string().min(10, "Please provide at least 10 characters explaining the issue"),
  userEmail: z.string().email().optional().or(z.literal("")),
});

export const adminResourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  resourceType: z.enum(["question_paper", "note", "syllabus"]),
  subjectId: z.string().min(1, "Subject is required"),
  fileUrl: z.string().url("Valid URL or file URL required").optional().or(z.literal("")),
  externalSourceUrl: z.string().url("Valid source URL required").optional().or(z.literal("")),
  sourceName: z.string().min(2, "Source name is required"),
  sourceUrl: z.string().url("Valid source URL is required"),
  isOfficial: z.boolean().default(false),
  verificationStatus: z.enum(["verified", "unverified", "pending_review"]).default("verified"),
  examYear: z.coerce.number().int().min(2000).max(2035).optional(),
  examSession: z.enum(["Apr/May", "Nov/Dec"]).optional(),
  paperKind: z.enum(["regular", "arrear", "supplementary"]).optional().default("regular"),
});
