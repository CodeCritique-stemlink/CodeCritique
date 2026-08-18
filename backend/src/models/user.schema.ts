import z from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().trim().max(50).optional(),
    lastName: z.string().trim().max(50).optional(),
    userName: z
      .string()
      .min(2, "Username must be at least 2 characters long.")
      .max(30, "Username cannot exceed 30 characters.")
      .trim()
      .optional(),
    profileImageUrl: z
      .string()
      .url("Please provide a valid profile image URL.")
      .trim()
      .optional(),
    interestedTagIds: z
      .array(z.number())
      .optional(),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];