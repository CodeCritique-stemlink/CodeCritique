import "dotenv/config"; 
import { createClerkClient } from "@clerk/express";
import { UserRepository } from "../repository/user.repository.js";
import type { User } from "../generated/prisma/client.js";
import type { UpdateUserInput } from "../models/user.schema.js";



const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});
const userRepository = new UserRepository();

export class UserService {
  userRepository: any;
  async findOrCreateLocalUser(clerkId: string): Promise<User> {
    
    let localUser = await userRepository.findByClerkId(clerkId);

    
    if (localUser) {
      return localUser;
    }
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      if (!email) {
        throw new Error("Clerk user account profiles must maintain a valid primary email address.");
      }

      const userData: any = {
        clerkId: clerkUser.id,
        email: email,
      };

      if (clerkUser.firstName) userData.firstName = clerkUser.firstName;
      if (clerkUser.lastName) userData.lastName = clerkUser.lastName;

      localUser = await userRepository.createUser(userData);
      return localUser;
    }

    
  async getUserProfile(userId: number): Promise<any> {
    return await userRepository.findById(userId);
  }
  async getByUserName(userName : string): Promise <User | null>{
    return await userRepository.findByUserName(userName)
  }

  async updateUserProfile(userId: number, data: UpdateUserInput): Promise<any> {
    return await userRepository.updateUser(userId, data);
  }

  async deleteUserProfile(userId : number):Promise <User>{
    return await userRepository.deleteUser(userId );
  }

  async incrementKarma(userId: number, points: number): Promise<User> {
    return await userRepository.incrementKarma(userId, points);
  }
 }