import z from "zod";
import { TransactionType } from "../../../generated/prisma/enums";

export const createRecordZodSchema = z.object({
  amount: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") {
      return Number(val);
    }
    return val;
  }, z.number().nonnegative("Amount can not be negative")),

  type: z.enum(
    [TransactionType.EXPENSE, TransactionType.INCOME],
    "Transaction must be either EXPENSE or INCOME",
  ),
  category: z
    .string("Category is required")
    .min(2, "Category name is too short")
    .max(50, "Category name is too long"),

  date: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date("Date is required")),

  notes: z.string().max(255, "Notes cannot exceed 255 characters").optional(),
});

export const updateRecordZodSchema = z.object({
  amount: z
    .preprocess((val) => {
      if (typeof val === "string" && val.trim() !== "") {
        return Number(val);
      }
      return val;
    }, z.number().nonnegative("Amount can not be negative"))
    .optional(),

  type: z
    .enum(
      [TransactionType.EXPENSE, TransactionType.INCOME],
      "Transaction must be either EXPENSE or INCOME",
    )
    .optional(),
  category: z
    .string("Category is required")
    .min(2, "Category name is too short")
    .max(50, "Category name is too long")
    .optional(),

  date: z
    .preprocess((arg) => {
      if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    }, z.date("Date is required"))
    .optional(),

  notes: z.string().max(255, "Notes cannot exceed 255 characters").optional(),
});
