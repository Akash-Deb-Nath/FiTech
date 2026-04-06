import { TransactionType } from "../../../generated/prisma/enums";
import { FinancialRecordWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  IFinancialRecordPayload,
  IUpdatedFinancialRecordPayload,
} from "./record.interface";

const createRecord = async (
  creatorId: string,
  payload: IFinancialRecordPayload,
) => {
  const record = await prisma.financialRecord.create({
    data: {
      ...payload,
      creatorId,
    },
  });
  return record;
};

const getRecords = async ({
  search,
  type,
  category,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  type: TransactionType | undefined;
  category: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: FinancialRecordWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          category: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          notes: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  if (type) {
    andConditions.push({
      type: type as TransactionType,
    });
  }
  if (category) {
    andConditions.push({
      category: category as string,
    });
  }

  const where: FinancialRecordWhereInput = { AND: andConditions };

  const [result, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.financialRecord.count({ where }),
  ]);
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateRecord = async (
  recordId: string,
  payload: IUpdatedFinancialRecordPayload,
) => {
  const result = await prisma.financialRecord.update({
    where: {
      id: recordId,
    },
    data: { ...payload },
  });
  return result;
};

const deleteRecord = async (recordId: string) => {
  const result = await prisma.financialRecord.update({
    where: { id: recordId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return result;
};

export const recordService = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
};
