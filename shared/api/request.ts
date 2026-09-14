import type { ApiErrorBody } from '@/types/api';
import { ApiError } from './api-error';

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  );
}

export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError(0, 'Нет соединения с сервером');
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    if (isApiErrorBody(body)) throw new ApiError(response.status, body.error, body.fieldErrors);
    throw new ApiError(response.status, `Ошибка сервера (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function postJson<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
