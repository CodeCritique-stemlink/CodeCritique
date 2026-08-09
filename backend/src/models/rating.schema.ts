import { z } from "zod";

export const createRatingSchema = z.object({
  score: z
    .number()
    .int()
    .min(1, "Score must be at least 1")
    .max(10, "Score cannot be greater than 10"),

  criteriaId: z
    .number()
    .int()
    .positive("Invalid criteria ID"),
});

export const updateRatingSchema = z.object({
  score: z
    .number()
    .int()
    .min(1, "Score must be at least 1")
    .max(10, "Score cannot be greater than 10"),
});

export const getRatingSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const getByReviewIdSchema = z.object({
  reviewId: z.coerce.number().int().positive(),
});

export const deleteRatingSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateRatingInput = z.infer<typeof createRatingSchema>;

export type UpdateRatingInput = z.infer<typeof updateRatingSchema>;

