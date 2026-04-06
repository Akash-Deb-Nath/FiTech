import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { DashboardService } from "./dashboard.service";

const getDashboardSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getDashboardSummary();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Dashboard summary retrieved successfully",
    data: result,
  });
});

const getCategoryTotals = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getCategoryTotals();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Category totals retrieved successfully",
    data: result,
  });
});

const getRecentActivity = catchAsync(async (req: Request, res: Response) => {
  const limit: number = Number(req.body.limit);
  const result = await DashboardService.getRecentActivity(limit);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Recent activity retrieved successfully",
    data: result,
  });
});

const getTrends = catchAsync(async (req: Request, res: Response) => {
  const period = req.body.limit;
  const result = await DashboardService.getRecentActivity(period);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Monthly or weekly data retrieved successfully",
    data: result,
  });
});

export const DashboardController = {
  getDashboardSummary,
  getCategoryTotals,
  getRecentActivity,
  getTrends,
};
