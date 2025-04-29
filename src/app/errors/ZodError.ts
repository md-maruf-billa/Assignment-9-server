import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error.interface';
import { TGenericErrorResponse } from '../interface/TGenericErrorResponse.interface';

export const ZodErrorHandler = (error: ZodError): TGenericErrorResponse => {
  const statusCode = 400;

  const errorSources: TErrorSource = error.issues.map((issue: ZodIssue) => ({
    path: issue.path[issue.path.length - 1]?.toString() || 'unknown',
    message: issue.message,
  }));

  return {
    statusCode,
    message: 'Validation error',
    errorSources,
  };
};
