import type { MenuItem } from '@/types/menu';

const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
const STEP_MS = 15 * 60 * 1000;

export function validateUntil(value: string | null, now = Date.now()): string | null {
  if (value === null) return null;
  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return 'Некорректное время';
  if (ts <= now) return 'Время должно быть в будущем';
  if (ts - now > MAX_AHEAD_MS) return 'Не больше чем на 24 часа вперёд';
  if (ts % STEP_MS !== 0) return 'Шаг — 15 минут';
  return null;
}

export const RESUME_BLOCKED_REASON = 'Нельзя вернуть в продажу: остаток 0';

export function canResume(item: MenuItem): boolean {
  return item.status.kind === 'stopped' && item.stock > 0;
}
