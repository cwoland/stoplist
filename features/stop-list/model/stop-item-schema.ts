import { z } from 'zod';
import type { StopReason } from '@/types/menu';
import { validateUntil } from './stop-rules';

export const STOP_REASONS = [
  'out_of_stock',
  'equipment',
  'quality',
  'menu_change',
] as const satisfies readonly StopReason[];

export const STOP_REASON_LABELS: Record<StopReason, string> = {
  out_of_stock: 'Закончились продукты',
  equipment: 'Сломалось оборудование',
  quality: 'Вопросы к качеству партии',
  menu_change: 'Выведена из меню смены',
};

export const stopItemSchema = z.object({
  reason: z.enum(STOP_REASONS, { error: 'Укажите причину' }),
  until: z
    .string()
    .nullable()
    .superRefine((value, ctx) => {
      const message = validateUntil(value);
      if (message) ctx.addIssue({ code: 'custom', message });
    }),
});

export type StopItemInput = z.infer<typeof stopItemSchema>;
