import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { stopItemSchema } from '@/features/stop-list/model/stop-item-schema';
import { jsonError } from '@/server/http';
import { getMenuItem, stopMenuItem } from '@/server/menu-store';
import { simulateNetwork } from '@/server/mock-network';

export async function POST(request: NextRequest, ctx: RouteContext<'/api/menu-items/[id]/stop'>) {
  const { id } = await ctx.params;

  const body: unknown = await request.json().catch(() => null);
  const parsed = stopItemSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, {
      error: 'Некорректные данные формы',
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  if (!getMenuItem(id)) {
    return jsonError(404, { error: 'Позиция не найдена' });
  }

  if (await simulateNetwork('mutation')) {
    return jsonError(500, { error: 'Сервер не ответил, попробуйте ещё раз' });
  }

  return Response.json(stopMenuItem(id, parsed.data));
}
