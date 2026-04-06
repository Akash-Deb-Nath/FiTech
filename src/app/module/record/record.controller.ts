import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { recordService } from "./record.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { TransactionType } from "../../../generated/prisma/enums";

const createRecord = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const payload = req.body;
  const result = await recordService.createRecord(id as string, payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Record created successfully",
    data: result,
  });
});

const getRecords = catchAsync(async (req: Request, res: Response) => {
  // const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
  const { search } = req.query;

  const searchString = typeof search === "string" ? search : undefined;

  const type = req.query.type as TransactionType | undefined;
  const category = req.query.category as string | undefined;

  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
    req.query,
  );

  const result = await recordService.getRecords({
    search: searchString,
    type,
    category,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  });
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Record created successfully",
    data: result,
  });
});

const updateRecord = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await recordService.updateRecord(id as string, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Record updated successfully",
    data: result,
  });
});

const deleteRecord = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await recordService.deleteRecord(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Record deleted successfully",
    data: result,
  });
});

export const RecordController = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
};
