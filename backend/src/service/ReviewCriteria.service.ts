import { ForbiddenError, NotFoundError } from "../errors/appError.js";
import type { CreateReviewCriteriaInput } from "../models/ReviewCriteria.schema.js";
import { ReviewCriteriaERepository } from "../repository/ReviewCriteria.repository.js";
import { SubmissionRepository } from "../repository/submission.repository.js";

const reviewCriteriaERepository = new ReviewCriteriaERepository();
const subbmissionRepository = new SubmissionRepository();

export class ReviewCriteriaService {
  async createReviewCriteria(data: CreateReviewCriteriaInput) {
    const submission = await subbmissionRepository.findById(data.submissionId);
    if (!submission) {
      throw new NotFoundError("Submission not found!");
    }
    return await reviewCriteriaERepository.createMany(data);
  }
  async findByCriteriaId(id: number) {
    const criteria = await reviewCriteriaERepository.findByCriteriaId(id);
    if (!criteria) {
      throw new NotFoundError("Criteria not found");
    }
    return criteria;
  }
  async findBySubmissionId(submissionId: number) {
    const submission = await subbmissionRepository.findById(submissionId);
    if (!submission) {
      throw new NotFoundError("Submission Id not found");
    }
    return await reviewCriteriaERepository.findBySubmissionId(submissionId);
  }
  async updateCriteria(id: number, name: string) {
    const reviewCriteria = await reviewCriteriaERepository.update(id, name);
    if (!reviewCriteria) {
      throw new NotFoundError("Review Criteria not found");
    }
    return reviewCriteria;
  }
  async deleteCriteria(id: number, userId:number) {
    const reviewCriteria = await reviewCriteriaERepository.findByCriteriaId(id);
    if (!reviewCriteria) {
      throw new NotFoundError("Review Criteria not found");
    }
      if (reviewCriteria.submission.userId !== userId) {
    throw new ForbiddenError(
      "You are not authorized to delete this review criteria"
    );
  }
    return await reviewCriteriaERepository.delete(id);
  }
}
