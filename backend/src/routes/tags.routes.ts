import { Router } from "express";
import { TagController } from "../controller/tags.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createTagSchema, tagIdParamSchema, updateTagSchema } from "../models/tags.schema.js";

const tagRouter = Router();
const controller = new TagController();

tagRouter.get("/", controller.getAll);
tagRouter.get("/:id", requireAuth, validate(tagIdParamSchema), controller.getById);
tagRouter.post("/", requireAuth, validate(createTagSchema), controller.create);
tagRouter.put("/:id", requireAuth, validate(updateTagSchema), controller.update);
tagRouter.delete("/:id", requireAuth, validate(tagIdParamSchema), controller.delete);

export default tagRouter;