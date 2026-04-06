import z from "zod";
import { Role, UserStatus } from "../../../generated/prisma/enums";

export const createUserZodSchema = z.object({
  name: z
    .string("Name is reuired")
    .min(5, "Name must be at least 5 characters")
    .max(100, "Name must be at most 100 characters"),

  email: z.email("Invalid email address"),

  password: z
    .string("Password is reuired")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),

  image: z.string().url("Image must be a valid URL").optional(),

  role: z
    .enum([Role.VIEWER, Role.ANALYST], "Role must be either VIEWER or ANALYST")
    .optional(),

  status: z
    .enum(
      [UserStatus.ACTIVE, UserStatus.INACTIVE],
      "Status must be either ACTIVE or INACTIVE",
    )
    .optional(),
});

export const loginUserZodSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string("Password is reuired")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});
