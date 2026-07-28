import { createClerkClient } from "@clerk/express";
import { UserRepository } from "../repository/user.repository.js";
import type { User } from "../generated/prisma/client.js";


const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});
const userRepository = new UserRepository();

