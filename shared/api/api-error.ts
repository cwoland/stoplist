import type { ApiErrorBody } from '@/types/api';

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: ApiErrorBody['fieldErrors'];

  constructor(status: number, message: string, fieldErrors?: ApiErrorBody['fieldErrors']) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
