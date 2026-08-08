import z from "zod";
import type { id } from "zod/locales";

export const createReviewSchema = z.object({
    params: z.object({
    submissionId: z.coerce.string().transform((val, ctx) => {
      const parsed = Number(val);

      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Submission ID must be a number",
        });
        return z.NEVER;
      }

      return parsed;
    }),
  }),
  body: z.object({
    strengths: z
      .string({ message: "Required" })
      .min(10, "strengths should contain meaningful code or context.")
      .trim(),
    improvements: z
      .string({ message: "Required" })
      .min(10, "improvements should contain meaningful code or context.")
      .trim(),
    resources: z
      .string()
      .min(10, "resources should contain meaningful context.")
      .trim()
      .optional(),

    ratings: z
      .array(
        z.object({
          criteriaId: z.number(),
          score: z.number().min(1).max(10),
        }),
      )
      .min(1),
  }),
});
export const getReviewSchema = z.object({
  params: z.object({
    reviewerId: z.string().transform((val, ctx) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Submission ID must be a number",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
});

export const getReviewBySubmissionSchema = z.object({
  params: z.object({
    submissionId: z.string().transform((val, ctx) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Submission ID must be a number",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
});

export const getReviewByIdSchema = z.object({
  params: z.object({
    id: z.string().transform((val, ctx) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Submission ID must be a number",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
});
export const deleteReviewSchema = z.object({
  params: z.object({
    id: z.string().transform((val, ctx) => {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ID must be a number",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
});

export type CreateReviewInputs = z.infer<typeof createReviewSchema>["body"];
