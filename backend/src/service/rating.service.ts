import type {
  CreateRatingInput,
  UpdateRatingInput,
} from "../models/rating.schema.js";
import { RatingRepository } from "../repository/rating.repository.js";
import { ReviewRepository } from "../repository/review.repository.js";

const ratingRepository = new RatingRepository();
const reviewRepository = new ReviewRepository();

export class RatingService {
  async create(reviewId: number, data: CreateRatingInput) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    return await ratingRepository.create(reviewId, data);
  }
  async findById(id: number) {
    const rating = await ratingRepository.findById(id);
    if (!rating) {
      throw new Error("Rating not found");
    }
    return rating;
  }
  async findByReview(reviewId: number) {
    const review = await ratingRepository.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    return await ratingRepository.findByReviewId(reviewId);
  }
  async updateRating(id: number, data: UpdateRatingInput) {
    const rating = await ratingRepository.update(id, data);
    if (!rating) {
      throw new Error("rating not found");
    }
    return rating;
  }
  async deleteRatinga(id: number, userId: number) {
    const rating = await ratingRepository.delete(id);
    if (!rating) {
      throw new Error("rating not found");
    }
    if (rating.submission.userId !== userId) {
      throw new Error("You are not authorized to delete this review criteria");
    }
  }
}
