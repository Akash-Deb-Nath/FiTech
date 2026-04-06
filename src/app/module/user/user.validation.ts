import z from "zod";
import { Role, UserStatus } from "../../../generated/prisma/enums";

export const updateUserZodSchema = z.object({
  role: z
    .enum([Role.VIEWER, Role.ANALYST], "Role must be either VIEWER or ANALYST")
    .optional(),

  status: z
    .enum(
      [UserStatus.ACTIVE, UserStatus.INACTIVE],
      "User status must be either ACTIVE or INACTIVE",
    )
    .optional(),
});
