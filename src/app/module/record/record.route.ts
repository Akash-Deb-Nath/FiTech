import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createRecordZodSchema,
  updateRecordZodSchema,
} from "./record.validation";
import { RecordController } from "./record.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma/enums";
import { apiLimiter } from "../../middleware/rateLimitter";

const router = Router();

router.post(
  "/",
  validateRequest(createRecordZodSchema),
  authMiddleware(Role.ADMIN),
  apiLimiter,
  RecordController.createRecord,
);
router.get(
  "/",
  authMiddleware(Role.ADMIN, Role.ANALYST),
  apiLimiter,
  RecordController.getRecords,
);
router.put(
  "/:id",
  validateRequest(updateRecordZodSchema),
  authMiddleware(Role.ADMIN),
  apiLimiter,
  RecordController.updateRecord,
);
router.patch(
  "/:id",
  authMiddleware(Role.ADMIN),
  apiLimiter,
  RecordController.deleteRecord,
);

export const RecordRoutes = router;
