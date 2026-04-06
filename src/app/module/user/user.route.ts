import { Router } from "express";
import { UserController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { updateUserZodSchema } from "./user.validation";
import { apiLimiter } from "../../middleware/rateLimitter";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware(Role.ADMIN),
  apiLimiter,
  UserController.getAllUsers,
);
router.get(
  "/:id",
  authMiddleware(Role.ADMIN),
  apiLimiter,
  UserController.getUserById,
);
router.put(
  "/:id",
  validateRequest(updateUserZodSchema),
  apiLimiter,
  authMiddleware(Role.ADMIN),
  UserController.updateUser,
);
router.patch(
  "/:id",
  authMiddleware(Role.ADMIN),
  apiLimiter,
  UserController.deleteUser,
);

export const UserRoutes = router;
