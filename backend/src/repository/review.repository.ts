import { prisma } from "../config/prisma.js";
import type { CreateReviewInputs } from "../models/review.schema.js";

export class ReviewRepository {
  async create(
    reviewerId: number,
    submissionId: number,
    data: CreateReviewInputs,
  ): Promise<any> {
    return await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          reviewerId,
          submissionId,
          strengths: data.strengths,
          improvements: data.improvements,
          resources: data.resources ?? null,
        },
      });

      if (data.ratings.length > 0) {
        await tx.rating.createMany({
          data: data.ratings.map((rating) => ({
            reviewId: review.id,
            criteriaId: rating.criteriaId,
            score: rating.score,
          })),
        });
      }

      await tx.user.update({
        where: {
          id: reviewerId,
        },
        data: {
          karmaPoints: {
            increment: 2,
          },
        },
      });

      await tx.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          status: "REVIEWED",
        },
      });

      return await tx.review.findUnique({
        where: {
          id: review.id,
        },
        include: {
          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              userName: true,
              karmaPoints: true,
              profileImageUrl: true,
            },
          },
          ratings: {
            include: {
              criteria: true,
            },
          },
          submission: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    });
  }

  async findById(id: number): Promise<any | null> {
    return await prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userName: true,
            karmaPoints: true,
            profileImageUrl: true,
          },
        },
        submission: true,
        ratings: {
          include: {
            criteria: true,
          },
        },
      },
    });
  }

  async getBySubmission(submissionId: number): Promise<any[]> {
    return await prisma.review.findMany({
      where: {
        submissionId,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userName: true,
            karmaPoints: true,
            profileImageUrl: true,
          },
        },
        ratings: {
          include: {
            criteria: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getByReviewer(reviewerId: number): Promise<any[]> {
    return await prisma.review.findMany({
      where: {
        reviewerId,
      },
      include: {
        submission: {
          select: {
            id: true,
            title: true,
            githubUrl: true,
          },
        },
        ratings: {
          include: {
            criteria: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async delete(id: number): Promise<any> {
    return await prisma.review.delete({
      where: {
        id,
      },
    });
  }
}
