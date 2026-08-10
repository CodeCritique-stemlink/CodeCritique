import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createSubmissionSchema, getSubmissionsQuerySchema, submissionIdParamSchema, updateSubmissionSchema } from "../models/submission.schema.js";
import { SubmissionController } from "../controller/submission.controller.js";

const submissionRouter = Router();
const controller = new SubmissionController();


submissionRouter.post("/", requireAuth, validate(createSubmissionSchema), controller.create);
submissionRouter.get("/", validate(getSubmissionsQuerySchema), controller.getAll);
submissionRouter.get("/:id", validate(submissionIdParamSchema), controller.getById);
submissionRouter.put("/:id", requireAuth, validate(updateSubmissionSchema), controller.update);
submissionRouter.delete("/:id", requireAuth, validate(submissionIdParamSchema), controller.delete);

export default submissionRouter;