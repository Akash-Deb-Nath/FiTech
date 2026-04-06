import { UserStatus } from "../../../generated/prisma/enums";

enum registerUserRole {
  VIEWER = "VIEWER",
  ANALYST = "ANALYST",
}

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  image: string;
  role: registerUserRole;
  status: UserStatus;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}
