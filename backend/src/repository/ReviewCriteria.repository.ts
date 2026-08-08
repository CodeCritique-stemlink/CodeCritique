import { prisma } from "../config/prisma.js";
import type { CreateReviewCriteriaInput } from "../models/ReviewCriteria.schema.js";

export class ReviewCriteriaERepository {
  async createMany(data: CreateReviewCriteriaInput) {
    const { submissionId, criteria } = data;

  return await prisma.$transaction(async (tx) => {
    await tx.reviewCriteria.createMany({
      data: criteria.map((name) => ({
        submissionId,
        name,
      })),
    });
    return await tx.reviewCriteria.findMany({
      where: {
        submissionId,
        name: { in: criteria },
      },
    });
  });
  }
  async findByCriteriaId(id: number) {
    return await prisma.reviewCriteria.findUnique({
      where: { id },
      include: {
        ratings: true,
        submission: true,
      },
    });
  }
  async findBySubmissionId(submissionId: number) {
    return await prisma.reviewCriteria.findMany({
      where: { submissionId },
      include: {
        ratings: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async update(id: number, name: string) {
    return await prisma.reviewCriteria.update({
      where: { id },
      data: {
        name,
      },
    });
  }

  async delete(id: number) {
    return await prisma.reviewCriteria.delete({
      where: { id },
    });
  }
}
