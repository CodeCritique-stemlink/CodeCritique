import { Router } from "express";
import { ReviewCriteriaController } from "../controller/reviewCriteria.controller.js";
import { createReviewCriteriaSchema, deleteReviewCriteriaSchema, reviewCriteriaIdSchema, updateReviewCriteriaSchema } from "../models/ReviewCriteria.schema.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const reviewCriteriaRouter = Router();
const controller = new ReviewCriteriaController();

reviewCriteriaRouter.post( "/", requireAuth, validate(createReviewCriteriaSchema), controller.create );
reviewCriteriaRouter.get( "/:id", requireAuth, validate(reviewCriteriaIdSchema),controller.findById);
reviewCriteriaRouter.put( "/:id", requireAuth, validate(updateReviewCriteriaSchema), controller.update );
reviewCriteriaRouter.get( "/submission/:submissionId", requireAuth,validate(reviewCriteriaIdSchema) ,controller.findBySubmissionId );
reviewCriteriaRouter.delete("/:id", requireAuth,validate(deleteReviewCriteriaSchema), controller.delete);

export default reviewCriteriaRouter