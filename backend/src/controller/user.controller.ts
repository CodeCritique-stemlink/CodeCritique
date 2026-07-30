import type { Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { catchAsync } from "../util/catchAsync.js";



const userService = new UserService();

export class UserController {
  getProfile = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user!.id;
      const user = await userService.getUserProfile(userId);

      if (!user) {
        throw new Error("User profile not found");
      }

      res.json({
        success: true,
        message: "User profile retrieved successfully",
        user,
      });
    },
  );

}
