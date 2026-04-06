import { Router } from "express";
import { AuthController } from "./auth.controller";
import { loginLimiter } from "../../middleware/rateLimitter";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema, loginUserZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  AuthController.registerUser,
);
router.post(
  "/login",
  loginLimiter,
  validateRequest(loginUserZodSchema),
  AuthController.loginUser,
);

export const AuthRoutes = router;
