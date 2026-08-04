import z from "zod";

export const createSubmissionSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "Title is required." })
      .min(3, "Title must be at least 3 characters long.")
      .max(100, "Title cannot exceed 100 characters.")
      .trim(),
    description: z
      .string({ message: "Description (code content) is required." })
      .min(10, "Description should contain meaningful code or context.")
      .trim(),
    githubUrl: z
      .string({ message: "GitHub URL is required." })
      .url("Please provide a valid GitHub repository or gist URL.")
      .regex(/^https:\/\/github\.com\//, "URL must start with https://github.com/")
      .trim(),
    tagIds: z.array(z.number()).optional(),
  }),
});

export const getSubmissionsQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
    limit: z
      .string()
      .optional()
      .default("10")
      .transform((val) => Math.min(50, Math.max(1, parseInt(val, 10) || 10))),
    sortBy: z
      .enum(["title", "createdAt"])
      .optional()
      .default("createdAt"),
    sortOrder: z
      .enum(["asc", "desc"])
      .optional()
      .default("desc"),
    search: z
      .string()
      .trim()
      .optional(),
    userId: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) || undefined : undefined)),
  }),
});

export const submissionIdParamSchema = z.object({
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

export const updateSubmissionSchema = z.object({
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
    title: z
      .string()
      .min(3, "Title must be at least 3 characters long.")
      .max(100, "Title cannot exceed 100 characters.")
      .trim()
      .optional(),
    description: z
      .string()
      .min(10, "Description should contain meaningful code or context.")
      .trim()
      .optional(),
    githubUrl: z
      .string()
      .url("Please provide a valid GitHub repository or gist URL.")
      .regex(/^https:\/\/github\.com\//, "URL must start with https://github.com/")
      .trim()
      .optional(),
    tagIds: z.array(z.number().int().positive()).optional(),
  }),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>["body"];
export type GetSubmissionsQueryInput = z.infer<typeof getSubmissionsQuerySchema>["query"];
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>["body"];