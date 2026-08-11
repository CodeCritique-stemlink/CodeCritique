import type { Request, Response } from "express";
import { TagService } from "../service/tags.service.js";
import { catchAsync } from "../util/catchAsync.js";

const tagService = new TagService();

export class TagController {
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { name } = req.validated.body;
    const tag = await tagService.createTag(name);
    res.status(201).json({ success: true, data: tag });
  });

  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const tags = await tagService.getAllTags();
    res.json({ success: true, data: tags });
  });

  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const tag = await tagService.getTagById(id);
    res.json({ success: true, data: tag });
  });

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    const { name } = req.validated.body;
    const update = await tagService.updateTag(id, name);
    res.json({ success: true, data: update });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.validated.params.id;
    await tagService.deleteTag(id);
    res.json({ success: true, message: "Tag deleted successfully" });
  });
}
