export interface TErrorSources {
  path: string;
  message: string;
}

export interface TErrorResponse {
  success: boolean;
  message: string;
  errorSources?: TErrorSources[];
  error?: unknown;
}

export interface ICustomError extends Error {
  statusCode?: number;
  errorSources?: TErrorSources[];
}
