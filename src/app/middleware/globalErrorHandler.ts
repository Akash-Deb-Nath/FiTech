/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { ZodError } from "zod";
import { envVars } from "../../config/envVars";
import {
  ICustomError,
  TErrorResponse,
  TErrorSources,
} from "../interfaces/error.interface";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.error(err);
  }

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  const errorSources: TErrorSources[] = [];

  if (err instanceof ZodError) {
    statusCode = status.BAD_REQUEST;
    message = "Validation Error";
    err.issues.forEach((issue) => {
      errorSources.push({
        path: issue.path.join("->") || "root",
        message: issue.message,
      });
    });
  } else if ((err as ICustomError).statusCode) {
    statusCode = (err as ICustomError).statusCode!;
    message = err.message || message;
    if ((err as ICustomError).errorSources) {
      errorSources.push(...(err as ICustomError).errorSources!);
    }
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err.stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
