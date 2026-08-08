import { Router } from "express";
import { ReviewController } from "../controller/review.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createReviewSchema, deleteReviewSchema, getReviewByIdSchema, getReviewBySubmissionSchema, getReviewSchema } from "../models/review.schema.js";

const reviewRouter = Router();
const controller = new ReviewController();


reviewRouter.post("/:submissionId", requireAuth, validate(createReviewSchema), controller.create);
reviewRouter.get("/submission/:submissionId", validate(getReviewBySubmissionSchema), controller.getBySubmissionId);
reviewRouter.get("/reviewer/:reviewerId", validate(getReviewSchema), controller.getByRevirwerId);
reviewRouter.get("/:id", validate(getReviewByIdSchema), controller.findReviewById);
reviewRouter.delete("/:id", requireAuth, validate(deleteReviewSchema), controller.delete);

export default reviewRouter