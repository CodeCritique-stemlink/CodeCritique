import type {
  
  UpdateRatingInput,
} from "../models/rating.schema.js";
import { RatingRepository } from "../repository/rating.repository.js";
import { ReviewRepository } from "../repository/review.repository.js";
import { NotFoundError, ForbiddenError } from "../errors/appError.js";

const ratingRepository = new RatingRepository();
const reviewRepository = new ReviewRepository();

export class RatingService {

  async findById(id: number) {
    const rating = await ratingRepository.findById(id);
    if (!rating) {
      throw new NotFoundError("Rating not found");
    }
    return rating;
  }
  async findByReview(reviewId: number) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundError("Review not found");
    }
    return await ratingRepository.findByReviewId(reviewId);
  }
  async updateRating(id: number, data: UpdateRatingInput) {
    const rating = await ratingRepository.update(id, data);
    if (!rating) {
      throw new NotFoundError("rating not found");
    }
    return rating;
  }
  async deleteRatinga(id: number, userId: number) {
    const rating = await ratingRepository.findById(id);
    if (!rating) {
      throw new Error("rating not found");
    }
    if (rating.review?.reviewerId !== userId) {
      throw new ForbiddenError("You are not authorized to delete this rating");
    }
    return await ratingRepository.delete(id)
  }
}
