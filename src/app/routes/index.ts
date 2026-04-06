import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { RecordRoutes } from "../module/record/record.route";
import { DashboardRoutes } from "../module/dashboard/dashboard.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/record", RecordRoutes);
router.use("/dashboard", DashboardRoutes);

export const IndexRoutes = router;
