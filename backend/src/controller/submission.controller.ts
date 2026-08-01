import type { Request, Response } from "express";
import { SubmissionService } from "../service/submission.service.js";
import { catchAsync } from "../util/catchAsync.js";
import type {
  CreateSubmissionInput,
  GetSubmissionsQueryInput,
  UpdateSubmissionInput,
} from "../models/submission.schema.js";

const submissionService = new SubmissionService();

export class SubmissionController {
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const body = req.validated.body as CreateSubmissionInput;
    const authenticatedUserId = req.user!.id;

    const newPost = await submissionService.createSubmission(
      authenticatedUserId,
      body,
    );
    res.status(201).json({ success: true, data: newPost });
  });

  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filters = req.validated.query as GetSubmissionsQueryInput;
    const { submissions, totalItems } =
      await submissionService.getAllSubmissions(filters);
    const totalPages = Math.ceil(totalItems / filters.limit);

    res.json({
      success: true,
      data: submissions,
      meta: {
        totalItems,
        currentPage: filters.page,
        totalPages,
        itemsPerPage: filters.limit,
      },
    });
  });

  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const submission = await submissionService.getSubmissionById(id);
    res.json({
      success: true,
      data: submission,
    });
  });

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const body = req.validated.body as UpdateSubmissionInput;
    const authenticatedUserId = req.user!.id;

    const updated = await submissionService.updateSubmission(
      id,
      authenticatedUserId,
      body,
    );
    res.json({ success: true, data: updated });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const authenticatedUserId = req.user!.id;

    await submissionService.deleteSubmission(id, authenticatedUserId);
    res.json({ success: true, message: "Submission deleted successfully" });
  });
}
