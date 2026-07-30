import { Router } from "express";
import userRouter from "./user.routes.js";


const globalRouter = Router();


globalRouter.use("/users", userRouter);

export default globalRouter;