import { createClerkClient, getAuth } from "@clerk/express";
import { UserRepository } from "../repository/user.repository.js";
import type { NextFunction, Request, Response } from "express";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});
const userRepository = new UserRepository();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        clerkId: string;
        email: string;
        firstName?: string | null;
        lastName?: string | null;
        userName: string;
      };
    }
  }
}
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const auth = getAuth(req);
  const clerkId = auth.userId;

  if (!clerkId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: No user authenticated",
    });
    return;
  }

  try {
    let localUser = await userRepository.findByClerkId(clerkId);
    if (!localUser) {
      console.log(
        `No local user found for clerkId: ${clerkId}. Creating new user...`,
      );
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        res.status(400).json({
          success: false,
          message: "User does not have an email address",
        });
        return;
      }
      const userData: any = {
        clerkId: clerkUser.id,
        email: email,
        userName: clerkUser.username ,
      };
      if (clerkUser.firstName) {
        userData.firstName = clerkUser.firstName;
      }
      if (clerkUser.lastName) {
        userData.lastName = clerkUser.lastName;
      }

      localUser = await userRepository.createUser(userData);
      console.log(`Successfully created local user ID: ${localUser.id}`); 
    }
    req.user = {
      id: localUser.id,
      clerkId: localUser.clerkId,
      email: localUser.email,
      firstName: localUser.firstName,
      lastName: localUser.lastName,
      userName: localUser.userName,
    };

    next();
  } catch (error: any) {
    
    console.error("Error in requireAuth middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
    return;
  }
};
