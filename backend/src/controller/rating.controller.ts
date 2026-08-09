import type { Request, Response } from "express";
import { RatingService } from "../service/rating.service.js";
import { catchAsync } from "../util/catchAsync.js";
import type {
  CreateRatingInput,
  UpdateRatingInput,
} from "../models/rating.schema.js";

const ratingService = new RatingService();

export class RatingController {
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const body = req.validated.body as CreateRatingInput;
    const reviewId = req.validated.params.reviewId;

    const rating = await ratingService.create(reviewId,body);
    res.status(201).json({ success: true, data: rating });
  });
  findRatingById = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const id = req.validated.params.id;
      const rating = await ratingService.findById(id);
      res.json({ success: true, data: rating });
    },
  );
  findByReviewId = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const reviewId = req.validated.params.reviewId;
      const rating = await ratingService.findByReview(reviewId);
      res.json({ success: true, data: rating });
    },
  );

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const body = req.validated.body as UpdateRatingInput;

    const updated = await ratingService.updateRating(id, body);
    res.json({ success: true, data: updated });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const userId = req.user!.id;

    await ratingService.deleteRatinga(id, userId);
    res.json({ success: true, message: "Rating deleted successfully" });
  });
}
