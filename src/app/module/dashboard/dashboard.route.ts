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
  DashboardController.getCategoryTotals,
);
router.get(
  "/recent",
  authMiddleware(),
  apiLimiter,
  DashboardController.getRecentActivity,
);
router.get(
  "/period",
  authMiddleware(),
  apiLimiter,
  DashboardController.getTrends,
);

export const DashboardRoutes = router;
