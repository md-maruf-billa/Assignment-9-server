import { TGenericErrorResponse } from '../interface/TGenericErrorResponse.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (error: any): TGenericErrorResponse => {
  // Extract the field causing the error using a regex
  const pathMatch = error.message.match(/path "([^"]*)"/);
  const path = pathMatch ? pathMatch[1] : 'unknown';

  // Extract additional message details if available
  const match = error.message.match(/"([^"]*)"/);
  const extractMessage = match ? match[1] : 'Unknown value';

  // Construct error sources array
  const errorSources = [
    {
      path, // The extracted path
      message: `${extractMessage} already exists`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Duplicate key error',
    errorSources,
  };
};
