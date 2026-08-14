import { z } from "zod";

export const submissionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  githubUrl: z.string().url("Enter a valid GitHub URL"),
  criteria: z.array(z.string().min(1)).min(1, "At least 1 criteria is required"),
});