import { Router } from "express";
import {  UserController } from "../controller/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { updateUserSchema } from "../models/user.schema.js";
import { validate } from "../middleware/validate.middleware.js";

const userRouter =Router();
const userController = new UserController();

userRouter.get("/profile", requireAuth, userController.getProfile);
userRouter.delete("/profile", requireAuth, userController.deleteProfile);
userRouter.put("/profile",requireAuth, validate(updateUserSchema), userController.updateProfile);


export default userRouter;