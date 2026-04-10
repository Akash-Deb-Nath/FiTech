import { TransactionType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getDashboardSummary = async () => {
  const income = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: { type: TransactionType.INCOME, isDeleted: false },
  });

  const expenses = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: { type: TransactionType.EXPENSE, isDeleted: false },
  });

  const netBalance = (income._sum.amount || 0) - (expenses._sum.amount || 0);

  return {
    income,
    expenses,
    netBalance,
  };
};

const getCategoryTotals = async () => {
  const categories = await prisma.financialRecord.groupBy({
    by: ["category"],
    where: {
      isDeleted: false,
    },
    _sum: { amount: true },
  });

  return categories.map((c) => ({
    category: c.category,
    total: c._sum.amount || 0,
  }));
};

const getRecentActivity = async (limit: number = 10) => {
  const recent = await prisma.financialRecord.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: { date: "desc" },
    take: limit,
  });

  return recent;
};

const getTrends = async (period: "month" | "week" = "month") => {
  const records = await prisma.financialRecord.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: { date: "asc" },
  });

  const grouped: Record<string, { income: number; expenses: number }> = {};

  for (const r of records) {
    const key =
      period === "month"
        ? `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, "0")}`
        : `${r.date.getFullYear()}-W${Math.ceil(r.date.getDate() / 7)}`;

    if (!grouped[key]) {
      grouped[key] = { income: 0, expenses: 0 };
    }

    if (r.type === TransactionType.INCOME) {
      grouped[key].income += r.amount;
    } else {
      grouped[key].expenses += r.amount;
    }
  }

  return Object.entries(grouped).map(([period, values]) => ({
    period,
    income: values.income,
    expenses: values.expenses,
  }));
};

export const DashboardService = {
  getDashboardSummary,
  getCategoryTotals,
  getRecentActivity,
  getTrends,
};
