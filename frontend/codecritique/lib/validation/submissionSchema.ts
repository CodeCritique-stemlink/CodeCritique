import { z } from "zod";

export const submissionSchema = z.object({
    title: z
      .string({ message: "Title is required." })
      .min(3, "Title must be at least 3 characters long.")
      .max(100, "Title cannot exceed 100 characters.")
      .trim(),
    description: z
      .string({ message: "Description (code content) is required." })
      .min(10, "Description should contain meaningful  context.")
      .trim(),
    githubUrl: z
      .string({ message: "GitHub URL is required." })
      .url("Please provide a valid GitHub repository or gist URL.")
      .regex(
        /^https:\/\/github\.com\//,
        "URL must start with https://github.com/",
      )
      .trim(),
    tagIds: z.array(z.number()).optional(),
  
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
