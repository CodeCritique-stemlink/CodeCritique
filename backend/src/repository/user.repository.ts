import { prisma } from "../config/prisma.js";
import type { User } from "../generated/prisma/client.js";

export class UserRepository {
  async findByClerkId(clerkId: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { clerkId } });
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    return await prisma.user.create({ data });
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
  async updateUser(userId: number, data: any): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getProfile(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }
}
