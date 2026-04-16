import { z } from "zod";

/** Report categories for article violations */
export const reportCategories = [
  { value: "SPAM_MISLEADING", label: "Spam or Misleading Content" },
  { value: "INAPPROPRIATE_LANGUAGE", label: "Inappropriate Language" },
  { value: "COPYRIGHT_INFRINGEMENT", label: "Copyright Infringement" },
  { value: "MISINFORMATION", label: "Misinformation" },
  { value: "VIOLENCE_HARMFUL", label: "Violent or Harmful Content" },
  { value: "OTHER", label: "Other" },
] as const;

/** Report status options */
export const reportStatuses = [
  { value: "PENDING", label: "Pending Review", color: "yellow" },
  { value: "UNDER_REVIEW", label: "Under Review", color: "blue" },
  { value: "RESOLVED", label: "Resolved", color: "green" },
  { value: "DISMISSED", label: "Dismissed", color: "gray" },
] as const;

/** Zod schema for report submission */
export const reportFormSchema = z.object({
  category: z.enum([
    "SPAM_MISLEADING",
    "INAPPROPRIATE_LANGUAGE", 
    "COPYRIGHT_INFRINGEMENT",
    "MISINFORMATION",
    "VIOLENCE_HARMFUL",
    "OTHER",
  ], {
    message: "Please select a report category",
  }),
  description: z.string().optional().refine((val) => {
    // Description is required when category is OTHER - we'll check this in the component
    return true;
  }),
}).superRefine((data, ctx) => {
  // Description is required when category is OTHER
  if (data.category === "OTHER" && (!data.description || data.description.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Description is required when reporting other issues",
      path: ["description"],
    });
  }
});

/** Zod schema for admin status update */
export const updateReportStatusSchema = z.object({
  status: z.enum([
    "UNDER_REVIEW",
    "RESOLVED", 
    "DISMISSED",
  ], {
    message: "Please select a status",
  }),
  adminNotes: z.string().optional(),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;
export type UpdateReportStatusValues = z.infer<typeof updateReportStatusSchema>;

/** Helper function to get category label */
export function getCategoryLabel(category: string): string {
  const found = reportCategories.find(c => c.value === category);
  return found?.label || category;
}

/** Helper function to get status label and color */
export function getStatusInfo(status: string) {
  const found = reportStatuses.find(s => s.value === status);
  return {
    label: found?.label || status,
    color: found?.color || "gray",
  };
}
