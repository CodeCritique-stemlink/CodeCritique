import { z } from "zod";

export const updateRatingSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid ID"),
  }),
  body: z.object({
    score: z
      .number()
      .int()
      .min(1, "Score must be at least 1")
      .max(10, "Score cannot be greater than 10"),
  }),
});

export const getRatingSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const getByReviewIdSchema = z.object({
  params: z.object({
    reviewId: z.coerce.number().int().positive(),
  }),
});



export const deleteRatingSchema = z.object({
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


export type UpdateRatingInput = z.infer<typeof updateRatingSchema>["body"];

