import { prisma } from "../config/prisma.js";
import type { Tag, User } from "../generated/prisma/client.js";
import type { UpdateUserInput } from "../models/user.schema.js"; 

export class UserRepository {
  async findByClerkId(clerkId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
    where: { id },
    include: {
      interestedTags: true, 
      submissions: true,
    },
  });
}

  async createUser(data: {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    userName: string;
  }): Promise<User> {
    return await prisma.user.create({ data });
  }

  async findByUserName(userName : string) :Promise < User | null>{
    return await prisma.user.findUnique({where : { userName }});
  }

  async incrementKarma(userId: number, points: number): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        karmaPoints: {
          increment: points,
        },
      },
    });
  }
  async updateUser(userId: number, data: UpdateUserInput): Promise<any> {
    const { interestedTagIds, ...rest } = data;
    const updateData: any = { ...rest };

    if (interestedTagIds !== undefined) {
      updateData.interestedTags = {
        set: interestedTagIds.map((id) => ({ id })),
      };
    }

    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        interestedTags: true,
      },
    });
  }

  async getProfile(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async deleteUser(userId: number):Promise<User>{
    return await prisma.user.delete({
      where:{id:userId},
    })
  }
}
