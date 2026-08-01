import { Router } from "express";
import userRouter from "./user.routes.js";
import submissionRouter from "./submission.routes.js";


const globalRouter = Router();


globalRouter.use("/users", userRouter);
globalRouter.use("/submissions", submissionRouter);

export default globalRouter;