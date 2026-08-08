import type { Request, Response } from "express";
import { ReviewCriteriaService } from "../service/ReviewCriteria.service.js";
import { catchAsync } from "../util/catchAsync.js";
import type {
  CreateReviewCriteriaInput,
  UpdateReviewCriteriaInput,
} from "../models/ReviewCriteria.schema.js";


const reviewCriteriaService = new ReviewCriteriaService();

export class ReviewCriteriaController {
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const body = req.validated.body as CreateReviewCriteriaInput;

    const reviewCriteria =
      await reviewCriteriaService.createReviewCriteria(body);
    res.status(201).json({ success: true, data: reviewCriteria });
  });

  findById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;

    const reviewCriteria = await reviewCriteriaService.findByCriteriaId(id);
    res.json({ success: true, date: reviewCriteria });
  });

  findBySubmissionId = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const submissionId = req.validated.params.submissionId;

      const reviewCriteria =
        await reviewCriteriaService.findBySubmissionId(submissionId);
      res.json({ success: true, data: reviewCriteria });
    },
  );
  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id); 
    const body = req.validated.body as UpdateReviewCriteriaInput;

    const updated = await reviewCriteriaService.updateCriteria(id, body.name);
    res.json({ success: true, data: updated });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const userId = req.user!.id;

    await reviewCriteriaService.deleteCriteria(id,userId);
    res.json({ success: true, message: "Criteria deleted successfully" });
  });
}
