import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface IUpdateUserPayload {
  status?: UserStatus;
  role?: Role;
}
