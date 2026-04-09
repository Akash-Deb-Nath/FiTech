import { z } from "zod";

export const periodSchema = z.enum(["month", "week"]);
