import { z } from "zod";



export const createReviewCriteriaSchema = z.object({
  body: z.object({
    submissionId: z.number().int().positive(),
    criteria: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Criteria name is required")
          .max(100, "Criteria name must be less than 100 characters"),
      )
      .min(1, "At least one criterion is required")
      .max(5, "A maximum of 5 criteria are allowed")
      .refine(
        (criteria) => {
          const names = criteria.map((name) => name.toLowerCase());
          return new Set(names).size === names.length;
        },
        {
          message: "Criteria names must be unique",
        },
      ),
  }),
});

export const updateReviewCriteriaSchema = z.object({
  body: z.object({
    name: z.string().min(10, "Criteria name is required").trim(),
  }),
});

export const reviewCriteriaIdSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => Number(val)),
  }),
});

export const deleteReviewCriteriaSchema = z.object({
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



export type CreateReviewCriteriaInput = z.infer<typeof createReviewCriteriaSchema>["body"];

export type UpdateReviewCriteriaInput = z.infer<typeof updateReviewCriteriaSchema>["body"];
