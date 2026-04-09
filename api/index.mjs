// src/app.ts
import express from "express";

// src/app/middleware/globalErrorHandler.ts
import status from "http-status";
import { ZodError } from "zod";

// src/config/envVars.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_EXPIRES_IN",
    "BETTER_AUTH_SESSION_UPDATE_AGE"
  ];
  requiredEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(
        `Environment variable ${variable} is required but not set in .env file`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_EXPIRES_IN,
    BETTER_AUTH_SESSION_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_UPDATE_AGE
  };
};
var envVars = loadEnvVariables();

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.error(err);
  }
  let statusCode = status.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  const errorSources = [];
  if (err instanceof ZodError) {
    statusCode = status.BAD_REQUEST;
    message = "Validation Error";
    err.issues.forEach((issue) => {
      errorSources.push({
        path: issue.path.join("->") || "root",
        message: issue.message
      });
    });
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message || message;
    if (err.errorSources) {
      errorSources.push(...err.errorSources);
    }
  } else if (err instanceof Error) {
    message = err.message || message;
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err.stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status2 from "http-status";
var notFound = (req, res) => {
  res.status(status2.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app/routes/index.ts
import { Router as Router5 } from "express";

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/app/module/auth/auth.controller.ts
import status3 from "http-status";

// src/generated/prisma/enums.ts
var Role = {
  ADMIN: "ADMIN",
  VIEWER: "VIEWER",
  ANALYST: "ANALYST"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
};
var TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE"
};

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.6.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id                 String            @id\n  name               String\n  email              String\n  emailVerified      Boolean           @default(false)\n  image              String?\n  createdAt          DateTime          @default(now())\n  updatedAt          DateTime          @updatedAt\n  role               Role              @default(VIEWER)\n  status             UserStatus        @default(ACTIVE)\n  needPasswordChange Boolean           @default(false)\n  isDeleted          Boolean           @default(false)\n  deletedAt          DateTime?\n  sessions           Session[]\n  accounts           Account[]\n  financialRecords   FinancialRecord[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  ADMIN\n  VIEWER\n  ANALYST\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n}\n\nenum TransactionType {\n  INCOME\n  EXPENSE\n}\n\nmodel FinancialRecord {\n  id String @id @default(uuid())\n\n  amount    Float\n  type      TransactionType\n  category  String\n  date      DateTime        @default(now())\n  notes     String?\n  isDeleted Boolean         @default(false)\n  deletedAt DateTime?\n\n  creatorId String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  creator User @relation(fields: [creatorId], references: [id])\n\n  @@index([type], name: "idx_financialData_type")\n  @@index([category], name: "idx_financialData_category")\n  @@index([date], name: "idx_financialData_date")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"financialRecords","kind":"object","type":"FinancialRecord","relationName":"FinancialRecordToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"FinancialRecord":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"type","kind":"enum","type":"TransactionType"},{"name":"category","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"notes","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"creatorId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"creator","kind":"object","type":"User","relationName":"FinancialRecordToUser"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","creator","financialRecords","_count","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","FinancialRecord.findUnique","FinancialRecord.findUniqueOrThrow","FinancialRecord.findFirst","FinancialRecord.findFirstOrThrow","FinancialRecord.findMany","FinancialRecord.createOne","FinancialRecord.createMany","FinancialRecord.createManyAndReturn","FinancialRecord.updateOne","FinancialRecord.updateMany","FinancialRecord.updateManyAndReturn","FinancialRecord.upsertOne","FinancialRecord.deleteOne","FinancialRecord.deleteMany","_avg","_sum","FinancialRecord.groupBy","FinancialRecord.aggregate","AND","OR","NOT","id","amount","TransactionType","type","category","date","notes","isDeleted","deletedAt","creatorId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","identifier","value","expiresAt","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","emailVerified","image","Role","role","UserStatus","status","needPasswordChange","every","some","none","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "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-AQAAAAF_AQAAAAGAAQEAAAABgQEBAAAAAYIBAQAAAAGDAQEAAAABhAFAAAAAAYUBQAAAAAGGAQEAAAABhwEBAAAAAQEOAABEACANZAEAAAABbkAAAAABb0AAAAABfgEAAAABfwEAAAABgAEBAAAAAYEBAQAAAAGCAQEAAAABgwEBAAAAAYQBQAAAAAGFAUAAAAABhgEBAAAAAYcBAQAAAAEBDgAARgAwAQ4AAEYAMA4DAADNAQAgZAEAvgEAIW5AAMEBACFvQADBAQAhfgEAvgEAIX8BAL4BACGAAQEAvgEAIYEBAQDCAQAhggEBAMIBACGDAQEAwgEAIYQBQADEAQAhhQFAAMQBACGGAQEAwgEAIYcBAQDCAQAhAgAAAAkAIA4AAEkAIA1kAQC-AQAhbkAAwQEAIW9AAMEBACF-AQC-AQAhfwEAvgEAIYABAQC-AQAhgQEBAMIBACGCAQEAwgEAIYMBAQDCAQAhhAFAAMQBACGFAUAAxAEAIYYBAQDCAQAhhwEBAMIBACECAAAABwAgDgAASwAgAgAAAAcAIA4AAEsAIAMAAAAJACAVAABEACAWAABJACABAAAACQAgAQAAAAcAIAoIAADKAQAgGwAAzAEAIBwAAMsBACCBAQAAuAEAIIIBAAC4AQAggwEAALgBACCEAQAAuAEAIIUBAAC4AQAghgEAALgBACCHAQAAuAEAIBBhAACgAQAwYgAAUgAQYwAAoAEAMGQBAIUBACFuQACIAQAhb0AAiAEAIX4BAIUBACF_AQCFAQAhgAEBAIUBACGBAQEAiQEAIYIBAQCJAQAhgwEBAIkBACGEAUAAiwEAIYUBQACLAQAhhgEBAIkBACGHAQEAiQEAIQMAAAAHACABAABRADAaAABSACADAAAABwAgAQAACAAwAgAACQAgCWEAAJ0BADBiAABYABBjAACdAQAwZAEAAAABbkAAnwEAIW9AAJ8BACF7AQCeAQAhfAEAngEAIX1AAJ8BACEBAAAAVQAgAQAAAFUAIAlhAACdAQAwYgAAWAAQYwAAnQEAMGQBAJ4BACFuQACfAQAhb0AAnwEAIXsBAJ4BACF8AQCeAQAhfUAAnwEAIQADAAAAWAAgAQAAWQAwAgAAVQAgAwAAAFgAIAEAAFkAMAIAAFUAIAMAAABYACABAABZADACAABVACAGZAEAAAABbkAAAAABb0AAAAABewEAAAABfAEAAAABfUAAAAABAQ4AAF0AIAZkAQAAAAFuQAAAAAFvQAAAAAF7AQAAAAF8AQAAAAF9QAAAAAEBDgAAXwAwAQ4AAF8AMAZkAQC-AQAhbkAAwQEAIW9AAMEBACF7AQC-AQAhfAEAvgEAIX1AAMEBACECAAAAVQAgDgAAYgAgBmQBAL4BACFuQADBAQAhb0AAwQEAIXsBAL4BACF8AQC-AQAhfUAAwQEAIQIAAABYACAOAABkACACAAAAWAAgDgAAZAAgAwAAAFUAIBUAAF0AIBYAAGIAIAEAAABVACABAAAAWAAgAwgAAMcBACAbAADJAQAgHAAAyAEAIAlhAACcAQAwYgAAawAQYwAAnAEAMGQBAIUBACFuQACIAQAhb0AAiAEAIXsBAIUBACF8AQCFAQAhfUAAiAEAIQMAAABYACABAABqADAaAABrACADAAAAWAAgAQAAWQAwAgAAVQAgAQAAAA0AIAEAAAANACADAAAACwAgAQAADAAwAgAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACAMBgAAxgEAIGQBAAAAAWUIAAAAAWcAAABnAmgBAAAAAWlAAAAAAWoBAAAAAWsgAAAAAWxAAAAAAW0BAAAAAW5AAAAAAW9AAAAAAQEOAABzACALZAEAAAABZQgAAAABZwAAAGcCaAEAAAABaUAAAAABagEAAAABayAAAAABbEAAAAABbQEAAAABbkAAAAABb0AAAAABAQ4AAHUAMAEOAAB1ADAMBgAAxQEAIGQBAL4BACFlCAC_AQAhZwAAwAFnImgBAL4BACFpQADBAQAhagEAwgEAIWsgAMMBACFsQADEAQAhbQEAvgEAIW5AAMEBACFvQADBAQAhAgAAAA0AIA4AAHgAIAtkAQC-AQAhZQgAvwEAIWcAAMABZyJoAQC-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_AQCeAQAhgAEBAJ4BACGBAQEAqwEAIYIBAQCrAQAhgwEBAKsBACGEAUAArgEAIYUBQACuAQAhhgEBAKsBACGHAQEAqwEAIQwDAAC1AQAgYQAAtwEAMGIAAAMAEGMAALcBADBkAQCeAQAhbkAAnwEAIW9AAJ8BACF9QACfAQAhgAEBAJ4BACGIAQEAngEAIYkBAQCrAQAhigEBAKsBACEAAAAAAAABnAEBAAAAAQWcAQgAAAABogEIAAAAAaMBCAAAAAGkAQgAAAABpQEIAAAAAQGcAQAAAGcCAZwBQAAAAAEBnAEBAAAAAQGcASAAAAABAZwBQAAAAAEFFQAAlAIAIBYAAJcCACCZAQAAlQIAIJoBAACWAgAgnwEAAAEAIAMVAACUAgAgmQEAAJUCACCfAQAAAQAgAAAAAAAABRUAAI8CACAWAACSAgAgmQEAAJACACCaAQAAkQIAIJ8BAAABACADFQAAjwIAIJkBAACQAgAgnwEAAAEAIAAAAAUVAACKAgAgFgAAjQIAIJkBAACLAgAgmgEAAIwCACCfAQAAAQAgAxUAAIoCACCZAQAAiwIAIJ8BAAABACAAAAABnAEAAACQAQIBnAEAAACSAQILFQAA9AEAMBYAAPkBADCZAQAA9QEAMJoBAAD2AQAwmwEAAPcBACCcAQAA-AEAMJ0BAAD4AQAwngEAAPgBADCfAQAA-AEAMKABAAD6AQAwoQEAAPsBADALFQAA6AEAMBYAAO0BADCZAQAA6QEAMJoBAADqAQAwmwEAAOsBACCcAQAA7AEAMJ0BAADsAQAwngEAAOwBADCfAQAA7AEAMKABAADuAQAwoQEAAO8BADALFQAA3AEAMBYAAOEBADCZAQAA3QEAMJoBAADeAQAwmwEAAN8BACCcAQAA4AEAMJ0BAADgAQAwngEAAOABADCfAQAA4AEAMKABAADiAQAwoQEAAOMBADAKZAEAAAABZQgAAAABZwAAAGcCaAEAAAABaUAAAAABagEAAAABayAAAAABbEAAAAABbkAAAAABb0AAAAABAgAAAA0AIBUAAOcBACADAAAADQAgFQAA5wEAIBYAAOYBACABDgAAiQIAMA8GAAC1AQAgYQAAsgEAMGIAAAsAEGMAALIBADBkAQAAAAFlCACzAQAhZwAAtAFnImgBAJ4BACFpQACfAQAhagEAqwEAIWsgAKoBACFsQACuAQAhbQEAngEAIW5AAJ8BACFvQACfAQAhAgAAAA0AIA4AAOYBACACAAAA5AEAIA4AAOUBACAOYQAA4wEAMGIAAOQBABBjAADjAQAwZAEAngEAIWUIALMBACFnAAC0AWciaAEAngEAIWlAAJ8BACFqAQCrAQAhayAAqgEAIWxAAK4BACFtAQCeAQAhbkAAnwEAIW9AAJ8BACEOYQAA4wEAMGIAAOQBABBjAADjAQAwZAEAngEAIWUIALMBACFnAAC0AWciaAEAngEAIWlAAJ8BACFqAQCrAQAhayAAqgEAIWxAAK4BACFtAQCeAQAhbkAAnwEAIW9AAJ8BACEKZAEAvgEAIWUIAL8BACFnAADAAWciaAEAvgEAIWlAAMEBACFqAQDCAQAhayAAwwEAIWxAAMQBACFuQADBAQAhb0AAwQEAIQpkAQC-AQAhZQgAvwEAIWcAAMABZyJoAQC-AQAhaUAAwQEAIWoBAMIBACFrIADDAQAhbEAAxAEAIW5AAMEBACFvQADBAQAhCmQBAAAAAWUIAAAAAWcAAABnAmgBAAAAAWlAAAAAAWoBAAAAAWsgAAAAAWxAAAAAAW5AAAAAAW9AAAAAAQxkAQAAAAFuQAAAAAFvQAAAAAF-AQAAAAF_AQAAAAGBAQEAAAABggEBAAAAAYMBAQAAAAGEAUAAAAABhQFAAAAAAYYBAQAAAAGHAQEAAAABAgAAAAkAIBUAAPMBACADAAAACQAgFQAA8wEAIBYAAPIBACABDgAAiAIAMBEDAAC1AQAgYQAAtgEAMGIAAAcAEGMAALYBADBkAQAAAAFuQACfAQAhb0AAnwEAIX4BAJ4BACF_AQCeAQAhgAEBAJ4BACGBAQEAqwEAIYIBAQCrAQAhgwEBAKsBACGEAUAArgEAIYUBQACuAQAhhgEBAKsBACGHAQEAqwEAIQIAAAAJACAOAADyAQAgAgAAAPABACAOAADxAQAgEGEAAO8BADBiAADwAQAQYwAA7wEAMGQBAJ4BACFuQACfAQAhb0AAnwEAIX4BAJ4BACF_AQCeAQAhgAEBAJ4BACGBAQEAqwEAIYIBAQCrAQAhgwEBAKsBACGEAUAArgEAIYUBQACuAQAhhgEBAKsBACGHAQEAqwEAIRBhAADvAQAwYgAA8AEAEGMAAO8BADBkAQCeAQAhbkAAnwEAIW9AAJ8BACF-AQCeAQAhfwEAngEAIYABAQCeAQAhgQEBAKsBACGCAQEAqwEAIYMBAQCrAQAhhAFAAK4BACGFAUAArgEAIYYBAQCrAQAhhwEBAKsBACEMZAEAvgEAIW5AAMEBACFvQADBAQAhfgEAvgEAIX8BAL4BACGBAQEAwgEAIYIBAQDCAQAhgwEBAMIBACGEAUAAxAEAIYUBQADEAQAhhgEBAMIBACGHAQEAwgEAIQxkAQC-AQAhbkAAwQEAIW9AAMEBACF-AQC-AQAhfwEAvgEAIYEBAQDCAQAhggEBAMIBACGDAQEAwgEAIYQBQADEAQAhhQFAAMQBACGGAQEAwgEAIYcBAQDCAQAhDGQBAAAAAW5AAAAAAW9AAAAAAX4BAAAAAX8BAAAAAYEBAQAAAAGCAQEAAAABgwEBAAAAAYQBQAAAAAGFAUAAAAABhgEBAAAAAYcBAQAAAAEHZAEAAAABbkAAAAABb0AAAAABfUAAAAABiAEBAAAAAYkBAQAAAAGKAQEAAAABAgAAAAUAIBUAAP8BACADAAAABQAgFQAA_wEAIBYAAP4BACABDgAAhwIAMAwDAAC1AQAgYQAAtwEAMGIAAAMAEGMAALcBADBkAQAAAAFuQACfAQAhb0AAnwEAIX1AAJ8BACGAAQEAngEAIYgBAQAAAAGJAQEAqwEAIYoBAQCrAQAhAgAAAAUAIA4AAP4BACACAAAA_AEAIA4AAP0BACALYQAA-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-FC8_AzBAAzFBAzJCAzNDAzRFAzVHBjZIFTdKAzhMBjlNFjpOAztPAzxQBj1TFz5UGz9WHEBXHEFaHEJbHENcHEReHEVgBkZhHUdjHEhlBklmHkpnHEtoHExpBk1sH05tI09uBFBvBFFwBFJxBFNyBFR0BFV2BlZ3JFd5BFh7Bll8JVp9BFt-BFx_Bl-CASZggwEs"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${envVars.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.VIEWER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day in seconds
    }
  },
  trustedOrigins: [envVars.BETTER_AUTH_URL || "http://localhost:5000"],
  advanced: {
    disableCSRFCheck: true
  }
});

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/auth.service.ts
var registerUser = async (payload) => {
  const data = await auth.api.signUpEmail({
    body: payload
  });
  if (!data.user) {
    throw new Error("Failed to register user");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data.user.status === UserStatus.INACTIVE) {
    throw new Error("User is inactive");
  }
  if (data.user.isDeleted) {
    throw new Error("User is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var AuthService = {
  registerUser,
  loginUser
};

// src/app/module/auth/auth.controller.ts
var registerUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.registerUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var AuthController = {
  registerUser: registerUser2,
  loginUser: loginUser2
};

// src/app/middleware/rateLimitter.ts
import rateLimit from "express-rate-limit";
var loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 5,
  message: "Too many login attempts"
});
var apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 100
});

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/module/auth/auth.validation.ts
import z from "zod";
var createUserZodSchema = z.object({
  name: z.string("Name is reuired").min(5, "Name must be at least 5 characters").max(100, "Name must be at most 100 characters"),
  email: z.email("Invalid email address"),
  password: z.string("Password is reuired").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  image: z.string().url("Image must be a valid URL").optional(),
  role: z.enum([Role.VIEWER, Role.ANALYST], "Role must be either VIEWER or ANALYST").optional(),
  status: z.enum(
    [UserStatus.ACTIVE, UserStatus.INACTIVE],
    "Status must be either ACTIVE or INACTIVE"
  ).optional()
});
var loginUserZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string("Password is reuired").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters")
});

// src/app/module/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  AuthController.registerUser
);
router.post(
  "/login",
  loginLimiter,
  validateRequest(loginUserZodSchema),
  AuthController.loginUser
);
var AuthRoutes = router;

// src/app/module/user/user.route.ts
import { Router as Router2 } from "express";

// src/app/module/user/user.service.ts
var getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });
  return users;
};
var getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
var updateUser = async (userId, payload) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: payload
  });
  return result;
};
var deleteUser = async (userId) => {
  const result = await prisma.$transaction(async (tx) => {
    try {
      await tx.financialRecord.updateMany({
        where: {
          creatorId: userId
        },
        data: {
          isDeleted: true,
          deletedAt: /* @__PURE__ */ new Date()
        }
      });
      const result2 = await tx.user.update({
        where: { id: userId },
        data: {
          isDeleted: true,
          deletedAt: /* @__PURE__ */ new Date()
        }
      });
      return result2;
    } catch (error) {
      console.log("Transaction Error : ", error);
      throw error;
    }
  });
  return result;
};
var UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

// src/app/module/user/user.controller.ts
import status4 from "http-status";
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Users fetched successfully",
    data: result
  });
});
var getUserById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getUserById(id);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "User fetched successfully",
    data: result
  });
});
var updateUser2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await UserService.updateUser(id, payload);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Users updated successfully",
    data: result
  });
});
var deleteUser2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.deleteUser(id);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "User deleted successfully",
    data: result
  });
});
var UserController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUser: updateUser2,
  deleteUser: deleteUser2
};

// src/app/module/user/user.validation.ts
import z2 from "zod";
var updateUserZodSchema = z2.object({
  role: z2.enum([Role.VIEWER, Role.ANALYST], "Role must be either VIEWER or ANALYST").optional(),
  status: z2.enum(
    [UserStatus.ACTIVE, UserStatus.INACTIVE],
    "User status must be either ACTIVE or INACTIVE"
  ).optional()
});

// src/app/middleware/authMiddleware.ts
import status5 from "http-status";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/middleware/authMiddleware.ts
var authMiddleware = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    if (!sessionToken) {
      throw new Error("Unauthorized access! No session token provided.");
    }
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
          console.log("Session Expiring Soon!!");
        }
        if (user.status === UserStatus.INACTIVE || user.isDeleted) {
          throw new AppError_default(
            status5.UNAUTHORIZED,
            "Unauthorized access! User is not active."
          );
        }
        if (user.isDeleted) {
          throw new AppError_default(
            status5.UNAUTHORIZED,
            "Unauthorized access! User is deleted."
          );
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new AppError_default(
            status5.FORBIDDEN,
            "Forbidden access! You do not have permission to access this resource."
          );
        }
        req.user = {
          id: user.id,
          role: user.role,
          email: user.email
        };
      }
      const accessToken2 = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken2) {
        throw new AppError_default(
          status5.UNAUTHORIZED,
          "Unauthorized access! No access token provided."
        );
      }
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(
        status5.UNAUTHORIZED,
        "Unauthorized access! No access token provided."
      );
    }
    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      envVars.ACCESS_TOKEN_SECRET
    );
    if (!verifiedToken.success) {
      throw new AppError_default(
        status5.UNAUTHORIZED,
        "Unauthorized access! Invalid access token."
      );
    }
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(
        status5.FORBIDDEN,
        "Forbidden access! You do not have permission to access this resource."
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/module/user/user.route.ts
var router2 = Router2();
router2.get(
  "/",
  authMiddleware(Role.ADMIN),
  apiLimiter,
  UserController.getAllUsers
);
router2.get(
  "/:id",
  authMiddleware(Role.ADMIN),
  apiLimiter,
  UserController.getUserById
);
router2.put(
  "/:id",
  validateRequest(updateUserZodSchema),
  apiLimiter,
  authMiddleware(Role.ADMIN),
  UserController.updateUser
);
router2.patch(
  "/:id",
  authMiddleware(Role.ADMIN),
  apiLimiter,
  UserController.deleteUser
);
var UserRoutes = router2;

// src/app/module/record/record.route.ts
import { Router as Router3 } from "express";

// src/app/module/record/record.validation.ts
import z3 from "zod";
var createRecordZodSchema = z3.object({
  amount: z3.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") {
      return Number(val);
    }
    return val;
  }, z3.number().nonnegative("Amount can not be negative")),
  type: z3.enum(
    [TransactionType.EXPENSE, TransactionType.INCOME],
    "Transaction must be either EXPENSE or INCOME"
  ),
  category: z3.string("Category is required").min(2, "Category name is too short").max(50, "Category name is too long"),
  date: z3.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z3.date("Date is required")),
  notes: z3.string().max(255, "Notes cannot exceed 255 characters").optional()
});
var updateRecordZodSchema = z3.object({
  amount: z3.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") {
      return Number(val);
    }
    return val;
  }, z3.number().nonnegative("Amount can not be negative")).optional(),
  type: z3.enum(
    [TransactionType.EXPENSE, TransactionType.INCOME],
    "Transaction must be either EXPENSE or INCOME"
  ).optional(),
  category: z3.string("Category is required").min(2, "Category name is too short").max(50, "Category name is too long").optional(),
  date: z3.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z3.date("Date is required")).optional(),
  notes: z3.string().max(255, "Notes cannot exceed 255 characters").optional()
});

// src/app/module/record/record.service.ts
var createRecord = async (creatorId, payload) => {
  const record = await prisma.financialRecord.create({
    data: {
      ...payload,
      creatorId
    }
  });
  return record;
};
var getRecords = async ({
  search,
  type,
  category,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          category: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          notes: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (type) {
    andConditions.push({
      type
    });
  }
  if (category) {
    andConditions.push({
      category
    });
  }
  const where = { AND: andConditions };
  const [result, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.financialRecord.count({ where })
  ]);
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var updateRecord = async (recordId, payload) => {
  const result = await prisma.financialRecord.update({
    where: {
      id: recordId
    },
    data: { ...payload }
  });
  return result;
};
var deleteRecord = async (recordId) => {
  const result = await prisma.financialRecord.update({
    where: { id: recordId },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return result;
};
var recordService = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};

// src/app/module/record/record.controller.ts
import status6 from "http-status";

// src/app/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/app/module/record/record.controller.ts
var createRecord2 = catchAsync(async (req, res) => {
  const { id } = req.user;
  const payload = req.body;
  const result = await recordService.createRecord(id, payload);
  sendResponse(res, {
    httpStatusCode: status6.CREATED,
    success: true,
    message: "Record created successfully",
    data: result
  });
});
var getRecords2 = catchAsync(async (req, res) => {
  const { search } = req.query;
  const searchString = typeof search === "string" ? search : void 0;
  const type = req.query.type;
  const category = req.query.category;
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(
    req.query
  );
  const result = await recordService.getRecords({
    search: searchString,
    type,
    category,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  });
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Record created successfully",
    data: result
  });
});
var updateRecord2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await recordService.updateRecord(id, payload);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Record updated successfully",
    data: result
  });
});
var deleteRecord2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await recordService.deleteRecord(id);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Record deleted successfully",
    data: result
  });
});
var RecordController = {
  createRecord: createRecord2,
  getRecords: getRecords2,
  updateRecord: updateRecord2,
  deleteRecord: deleteRecord2
};

// src/app/module/record/record.route.ts
var router3 = Router3();
router3.post(
  "/",
  validateRequest(createRecordZodSchema),
  authMiddleware(Role.ADMIN),
  apiLimiter,
  RecordController.createRecord
);
router3.get(
  "/",
  authMiddleware(Role.ADMIN, Role.ANALYST),
  apiLimiter,
  RecordController.getRecords
);
router3.put(
  "/:id",
  validateRequest(updateRecordZodSchema),
  authMiddleware(Role.ADMIN),
  apiLimiter,
  RecordController.updateRecord
);
router3.patch(
  "/:id",
  authMiddleware(Role.ADMIN),
  apiLimiter,
  RecordController.deleteRecord
);
var RecordRoutes = router3;

// src/app/module/dashboard/dashboard.route.ts
import { Router as Router4 } from "express";

// src/app/module/dashboard/dashboard.controller.ts
import status7 from "http-status";

// src/app/module/dashboard/dashboard.service.ts
var getDashboardSummary = async () => {
  const income = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: { type: TransactionType.INCOME }
  });
  const expenses = await prisma.financialRecord.aggregate({
    _sum: { amount: true },
    where: { type: TransactionType.EXPENSE }
  });
  const netBalance = (income._sum.amount || 0) - (expenses._sum.amount || 0);
  return {
    income,
    expenses,
    netBalance
  };
};
var getCategoryTotals = async () => {
  const categories = await prisma.financialRecord.groupBy({
    by: ["category"],
    _sum: { amount: true }
  });
  return categories.map((c) => ({
    category: c.category,
    total: c._sum.amount || 0
  }));
};
var getRecentActivity = async (limit = 10) => {
  const recent = await prisma.financialRecord.findMany({
    orderBy: { date: "desc" },
    take: limit
  });
  return recent;
};
var getTrends = async (period = "month") => {
  const records = await prisma.financialRecord.findMany({
    orderBy: { date: "asc" }
  });
  const grouped = {};
  for (const r of records) {
    const key = period === "month" ? `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, "0")}` : `${r.date.getFullYear()}-W${Math.ceil(r.date.getDate() / 7)}`;
    if (!grouped[key]) {
      grouped[key] = { income: 0, expenses: 0 };
    }
    if (r.type === TransactionType.INCOME) {
      grouped[key].income += r.amount;
    } else {
      grouped[key].expenses += r.amount;
    }
  }
  return Object.entries(grouped).map(([period2, values]) => ({
    period: period2,
    income: values.income,
    expenses: values.expenses
  }));
};
var DashboardService = {
  getDashboardSummary,
  getCategoryTotals,
  getRecentActivity,
  getTrends
};

// src/app/module/dashboard/dashboard.validation.ts
import { z as z4 } from "zod";
var periodSchema = z4.enum(["month", "week"]);

// src/app/module/dashboard/dashboard.controller.ts
var getDashboardSummary2 = catchAsync(async (req, res) => {
  const result = await DashboardService.getDashboardSummary();
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Dashboard summary retrieved successfully",
    data: result
  });
});
var getCategoryTotals2 = catchAsync(async (req, res) => {
  const result = await DashboardService.getCategoryTotals();
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Category totals retrieved successfully",
    data: result
  });
});
var getRecentActivity2 = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const result = await DashboardService.getRecentActivity(limit);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Recent activity retrieved successfully",
    data: result
  });
});
var getTrends2 = catchAsync(async (req, res) => {
  const period = periodSchema.parse(req.query.period ?? "month");
  const result = await DashboardService.getTrends(period);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Monthly or weekly data retrieved successfully",
    data: result
  });
});
var DashboardController = {
  getDashboardSummary: getDashboardSummary2,
  getCategoryTotals: getCategoryTotals2,
  getRecentActivity: getRecentActivity2,
  getTrends: getTrends2
};

// src/app/module/dashboard/dashboard.route.ts
var router4 = Router4();
router4.get(
  "/summary",
  authMiddleware(),
  apiLimiter,
  DashboardController.getDashboardSummary
);
router4.get(
  "/category-wise",
  authMiddleware(),
  apiLimiter,
  DashboardController.getCategoryTotals
);
router4.get(
  "/recent",
  authMiddleware(),
  apiLimiter,
  DashboardController.getRecentActivity
);
router4.get(
  "/period",
  authMiddleware(),
  apiLimiter,
  DashboardController.getTrends
);
var DashboardRoutes = router4;

// src/app/routes/index.ts
var router5 = Router5();
router5.use("/auth", AuthRoutes);
router5.use("/users", UserRoutes);
router5.use("/records", RecordRoutes);
router5.use("/dashboard", DashboardRoutes);
var IndexRoutes = router5;

// src/app.ts
import cookieParser from "cookie-parser";
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", IndexRoutes);
app.get("/", (req, res) => {
  res.send("Hello, This is FiTech");
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;
export {
  app_default as default
};
