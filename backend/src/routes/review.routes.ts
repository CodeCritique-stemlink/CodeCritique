import { Router } from "express";
import { ReviewController } from "../controller/review.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createReviewSchema, deleteReviewSchema, getReviewSchema } from "../models/review.schema.js";

const reviewRouter = Router();
const controller = new ReviewController();


reviewRouter.post("/:submissionId", requireAuth, validate(createReviewSchema), controller.create);
reviewRouter.get("/:id", validate(getReviewSchema), controller.getByRevirwerId);
reviewRouter.get("/:id", validate(getReviewSchema), controller.getBySubmissionId);
reviewRouter.get("/:id", validate(getReviewSchema), controller.findReviewById);
reviewRouter.delete("/:id", requireAuth, validate(deleteReviewSchema), controller.delete);

export default reviewRouter