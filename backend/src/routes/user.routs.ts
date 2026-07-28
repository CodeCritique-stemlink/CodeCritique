import { Router } from "express";
import {  UserController } from "../controller/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const userRouter =Router();
const userController = new UserController();

userRouter.get("/profile", requireAuth, userController.getProfile);

export default userRouter;