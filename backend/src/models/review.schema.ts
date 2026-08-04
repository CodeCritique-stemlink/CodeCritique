import z from "zod";

export const createReviewSchema = z.object({
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

export type CreateReviewInputs = z.infer<typeof createReviewSchema>["body"];
