import type { CreateReviewInputs } from "../models/review.schema.js";
import { ReviewRepository } from "../repository/review.repository.js";
import { SubmissionRepository } from "../repository/submission.repository.js";

const reviewRepository = new ReviewRepository();
const subbmissionRepository = new SubmissionRepository();

export class ReviewService {
  async createReview(
    reviewerId: number,
    submissionId: number,
    data: CreateReviewInputs,
  ) {
    const submission = await subbmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error("Submission not found!");
    }
    return await reviewRepository.createWithKarma(
      reviewerId,
      submissionId,
      data,
    );
  }
  async findReviewById(id: number) {
    const review = await reviewRepository.findById(id);
    if (!review) {
      throw new Error("Review not found!");
    }
    return review
  }
  async getBySubmissionId(submissionId: number) {
    const submission = await subbmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error("Submission not found!");
    }
    return await reviewRepository.getBySubmission(submissionId);
  }
  async getByReviewer(reviewerId: number) {
    return await reviewRepository.getByReviewer(reviewerId);
  }
  async deleteReview(id:number,userId:number){
       const review = await reviewRepository.findById(id);
    if (!review) {
      throw new Error("Comment not found");
    }
    if (review.reviewId !== userId) {
      throw new Error("You are not authorized to delete this comment");
    }
    return await reviewRepository.deleteReview(id);
  }

}
