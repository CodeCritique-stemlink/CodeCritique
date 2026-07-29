import type { Request, Response } from "express";


export class UserController {
  getProfile = async (req: Request, res: Response): Promise<void> => {
    res.json({
      success: true,
      message: "User profile retrieved successfully",
      user: req.user,
    });
    return
  };
}

