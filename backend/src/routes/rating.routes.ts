import { Router } from "express";
import { RatingController } from "../controller/rating.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createRatingSchema, deleteRatingSchema, getByReviewIdSchema, getRatingSchema, updateRatingSchema } from "../models/rating.schema.js";

const ratingaRouter = Router();
const controller = new RatingController();

ratingaRouter.post( "/:reviewId", requireAuth, validate(createRatingSchema), controller.create );
ratingaRouter.get( "/:id", requireAuth, validate(getRatingSchema),controller.findRatingById);
ratingaRouter.get( "/reviewe/:revieweId", requireAuth, validate(getByReviewIdSchema),controller.findRatingById);
ratingaRouter.put( "/:id", requireAuth, validate(updateRatingSchema), controller.update );
ratingaRouter.delete("/:id", requireAuth, validate(deleteRatingSchema), controller.delete);

export default ratingaRouter