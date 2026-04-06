import { TransactionType } from "../../../generated/prisma/enums";

export interface IFinancialRecordPayload {
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  notes?: string;
}

export interface IUpdatedFinancialRecordPayload {
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: Date;
  notes?: string;
}

export enum RecordTransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}
