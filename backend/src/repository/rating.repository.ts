import { prisma } from "../config/prisma.js";
import type {
  CreateRatingInput,
  UpdateRatingInput,
} from "../models/rating.schema.js";

export class RatingRepository {
  async create(reviewId: number, data: CreateRatingInput): Promise<any> {
    return await prisma.rating.create({
      data: {
        reviewId,
        criteriaId: data.criteriaId,
        score: data.score,
      },
    });
  }
  async findById(id: number): Promise<any | null> {
    return await prisma.rating.findUnique({
      where: { id },
      
    });
  }
  async findByReviewId(reviewId: number): Promise<any> {
    return await prisma.rating.findMany({
      where: {
        reviewId,
      },
      include: {
        criteria: true,
      },
    });
  }
  async update(id: number, data: UpdateRatingInput): Promise<any> {
    return await prisma.rating.update({
      where: {
        id,
      },
      data: {
        score: data.score,
      },
    });
  }
    async delete(id: number) :Promise<any>{
    return await prisma.rating.delete({
      where: { id },
    });
  }

}
