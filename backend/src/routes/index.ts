import { Router } from "express";
import userRouter from "./user.routs.js";


const globalRouter = Router();


globalRouter.use("/users", userRouter);

export default globalRouter;