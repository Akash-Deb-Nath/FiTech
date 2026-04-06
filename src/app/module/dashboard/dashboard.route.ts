import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { apiLimiter } from "../../middleware/rateLimitter";

const router = Router();

router.get(
  "/summary",
  authMiddleware(),
  apiLimiter,
  DashboardController.getDashboardSummary,
);
router.get(
  "/category-wise",
  authMiddleware(),
  apiLimiter,
  DashboardController.getDashboardSummary,
);
router.get(
  "/recent",
  authMiddleware(),
  apiLimiter,
  DashboardController.getDashboardSummary,
);
router.get(
  "/period",
  authMiddleware(),
  apiLimiter,
  DashboardController.getDashboardSummary,
);

export const DashboardRoutes = router;
