import { z } from 'zod';
import type { MenuItem, StopItemPayload } from '@/types/menu';
import { stopItemSchema } from './stop-item-schema';
import { validateUntil } from './stop-rules';

export const UNTIL_MODES = ['shift', 'time'] as const;
export type UntilMode = (typeof UNTIL_MODES)[number];

interface UntilFields {
  mode: UntilMode;
  time: string;
}

function untilToIso({ mode, time }: UntilFields): string | null {
  if (mode === 'shift') return null;
  const ts = Date.parse(time);
  return Number.isNaN(ts) ? time : new Date(ts).toISOString();
}

export const stopItemFormSchema = z
  .object({
    reason: z.string().pipe(stopItemSchema.shape.reason),
    until: z.object({ mode: z.enum(UNTIL_MODES), time: z.string() }).superRefine((until, ctx) => {
      const message =
        until.mode === 'time' && until.time === ''
          ? 'Укажите время'
          : validateUntil(untilToIso(until));
      if (message) ctx.addIssue({ code: 'custom', path: ['time'], message });
    }),
  })
  .transform((form): StopItemPayload => ({ reason: form.reason, until: untilToIso(form.until) }));

export type StopItemFormInput = z.input<typeof stopItemFormSchema>;
export type StopItemFormOutput = z.output<typeof stopItemFormSchema>;

const pad = (n: number) => String(n).padStart(2, '0');

function toLocalDateTimeValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getStopItemFormDefaults(item: MenuItem): StopItemFormInput {
  if (item.status.kind === 'stopped') {
    const { until } = item.status;
    return {
      reason: item.status.reason,
      until: {
        mode: until ? 'time' : 'shift',
        time: until ? toLocalDateTimeValue(new Date(until)) : '',
      },
    };
  }
  return { reason: '', until: { mode: 'shift', time: '' } };
}

const STEP_MS = 15 * 60 * 1000;
const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;

export function getUntilBounds(now = Date.now()): { min: string; max: string } {
  const min = Math.ceil((now + 1) / STEP_MS) * STEP_MS;
  return {
    min: toLocalDateTimeValue(new Date(min)),
    max: toLocalDateTimeValue(new Date(now + MAX_AHEAD_MS)),
  };
}
