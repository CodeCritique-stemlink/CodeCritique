import { Router } from "express";
import userRouter from "./user.routes.js";
import submissionRouter from "./submission.routes.js";
import reviewRouter from "./review.routes.js";
import reviewCriteriaRouter from "./ReviewCriteria.routes.js";
import ratingaRouter from "./rating.routes.js";
import tagRouter from "./tags.routes.js";


const globalRouter = Router();


globalRouter.use("/users", userRouter);
globalRouter.use("/submissions", submissionRouter);
globalRouter.use("/reviews", reviewRouter);
globalRouter.use("/criterias", reviewCriteriaRouter);
globalRouter.use("/ratings", ratingaRouter);
globalRouter.use("/tags", tagRouter);

export default globalRouter;