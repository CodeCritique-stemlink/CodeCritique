import { prisma } from "../config/prisma.js";
import type { Tag } from "../generated/prisma/client.js";

export class TagRepository {
  async create(name: string): Promise<Tag> {
    try {
      return await prisma.tag.create({
        data: { name },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("A tag with this name already exists");
      }
      throw error;
    }
  }

  async getAll(): Promise<Tag[]> {
    return await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findById(id: number): Promise<Tag | null> {
    return await prisma.tag.findUnique({
      where: { id },
    });
  }

  async update(id: number, name: string): Promise<Tag> {
    try {
      return await prisma.tag.update({
        where: { id },
        data: { name },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("A tag with this name already exists");
      }
      throw error;
    }
  }
  
  async delete(id: number): Promise<Tag> {
    return await prisma.tag.delete({
      where: { id },
    });
  }
}
