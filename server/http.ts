import type { ApiErrorBody } from '@/types/api';

export function jsonError(status: number, body: ApiErrorBody): Response {
  return Response.json(body, { status });
}
