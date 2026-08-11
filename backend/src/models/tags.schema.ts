import z from "zod";

export const createTagSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Tag name is required." })
      .min(2, "Tag name must be at least 2 characters long.")
      .max(20, "Tag name cannot exceed 20 characters.")
      .trim()
      .toLowerCase(),
  }),
});

export const updateTagSchema = z.object({
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
  body: z.object({
    name: z
      .string({ message: "Tag name is required." })
      .min(2, "Tag name must be at least 2 characters long.")
      .max(20, "Tag name cannot exceed 20 characters.")
      .trim()
      .toLowerCase(),
  }),
});

export const tagIdParamSchema = z.object({
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

export type CreateTagInput = z.infer<typeof createTagSchema>["body"];
export type UpdateTagInput = z.infer<typeof updateTagSchema>["body"];
