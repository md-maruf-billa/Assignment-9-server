import { TErrorSource } from './error.interface';

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource;
  stack?: string | null;
};
