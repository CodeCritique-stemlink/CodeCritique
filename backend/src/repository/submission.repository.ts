import { prisma } from "../config/prisma.js";
import type {
  CreateSubmissionInput,
  GetSubmissionsQueryInput,
  UpdateSubmissionInput,
} from "../models/submission.schema.js";

export class SubmissionRepository {
  async create(userId: number, data: CreateSubmissionInput): Promise<any> {
    const { tagIds, ...rest } = data;
    const createData: any = { userId, ...rest };
    if (tagIds && tagIds.length > 0) {
      createData.tags = {
        connect: tagIds.map((id) => ({ id })),
      };
    }

    return await prisma.submission.create({
      data: createData,
      include: {
        tags: true,
      },
    });
  }


  async findById(id: number): Promise<any | null> {
    return await prisma.submission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            karmaPoints: true,
            userName: true,
            profileImageUrl: true,
          },
        },
        tags: true,
      },
    });
  }
  async update(id: number, data: UpdateSubmissionInput): Promise<any> {
    const { tagIds, ...rest } = data;
    const updateData: any = { ...rest };

    if (tagIds !== undefined) {
      updateData.tags = {
        set: tagIds.map((tagId: number) => ({ id: tagId })),
      };
    }

    return await prisma.submission.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            karmaPoints: true,
            userName: true,
            profileImageUrl: true,
          },
        },
        tags: true,
      },
    });
  }
  async delete(id: number): Promise<any> {
    return await prisma.submission.delete({
      where: { id },
    });
  }
  async getAll(filters: GetSubmissionsQueryInput) {
    const { page, limit, sortBy, sortOrder, search, userId } = filters;
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (userId) {
      whereClause.userId = userId;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [submissions, totalItems] = await prisma.$transaction([
      prisma.submission.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              karmaPoints: true,
              userName: true,
              profileImageUrl: true,
            },
          },
          tags: true,
        },
      }),
      prisma.submission.count({ where: whereClause }),
    ]);

    return { submissions, totalItems };
  }
}
