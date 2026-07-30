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
  async findOrCreateLocalUser(clerkId: string): Promise<User> {
    
    let localUser = await userRepository.findByClerkId(clerkId);

    
    if (!localUser) {
      
    
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
    }
      return localUser;
    }

    
  async getUserProfile(userId: number): Promise<any> {
     const user = await userRepository.findById(userId);

     if(!user){
      throw new Error("Not Found")
     }
     return user
  }
  async getByUserName(userName : string): Promise <User | null>{
    const userByName = await userRepository.findByUserName(userName);

    if(!userByName){
      throw new Error("User Not Found")
    }
    return userByName
  }

  async updateUserProfile(userId: number, data: UpdateUserInput): Promise<any> {
    const existingUser  = await userRepository.updateUser(userId, data);

    if(!existingUser ){
      throw new Error("User Not Found")
    } 
    return existingUser
  }


    
}