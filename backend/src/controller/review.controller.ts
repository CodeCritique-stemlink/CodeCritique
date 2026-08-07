import type { Request, Response } from "express";
import type { CreateReviewInputs } from "../models/review.schema.js";
import { ReviewService } from "../service/review.service.js";
import { catchAsync } from "../util/catchAsync.js";

const reviewService = new ReviewService();

export class ReviewController {
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const body = req.validated.body as CreateReviewInputs;
    const SubmissionId = req.validated.params.submissionId;
    const userId = req.user!.id;

    const review = await reviewService.createReview(userId, SubmissionId, body);
    res.status(201).json({ success: true, data: review });
  });
  findReviewById = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const id = req.validated.params.id;

      const review = await reviewService.findReviewById(id);
      res.json({ success: true, data: review });
    },
  );
  getBySubmissionId = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const submissionId = req.validated.params.submissionId;

      const review = await reviewService.getBySubmissionId(submissionId);
      res.json({ success: true, data: review });
    },
  );
  getByRevirwerId = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const reviewerId = req.validated.params.reviewerId;

      const review = await reviewService.getByReviewer(reviewerId);
      res.json({ success: true, data: review });
    },
  );
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const userId = req.user!.id;

    await reviewService.deleteReview(id, userId);
    res.json({ success: true, message: "Review deleted successfully" });
  });
}
