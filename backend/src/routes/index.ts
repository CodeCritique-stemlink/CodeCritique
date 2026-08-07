import { Router } from "express";
import userRouter from "./user.routes.js";
import submissionRouter from "./submission.routes.js";
import reviewRouter from "./review.routes.js";


const globalRouter = Router();


globalRouter.use("/users", userRouter);
globalRouter.use("/submissions", submissionRouter);
globalRouter.use("/reviews", reviewRouter);

export default globalRouter;