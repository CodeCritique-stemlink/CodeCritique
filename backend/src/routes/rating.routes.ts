import { Router } from "express";
import { RatingController } from "../controller/rating.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {  deleteRatingSchema, getByReviewIdSchema, getRatingSchema, updateRatingSchema } from "../models/rating.schema.js";

const ratingaRouter = Router();
const controller = new RatingController();

ratingaRouter.get( "/:id", requireAuth, validate(getRatingSchema),controller.findRatingById);
ratingaRouter.get( "/review/:reviewId", requireAuth, validate(getByReviewIdSchema),controller.findByReviewId);
ratingaRouter.put( "/:id", requireAuth, validate(updateRatingSchema), controller.update );
ratingaRouter.delete("/:id", requireAuth, validate(deleteRatingSchema), controller.delete);

export default ratingaRouter