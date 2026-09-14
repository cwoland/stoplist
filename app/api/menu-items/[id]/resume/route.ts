import type { NextRequest } from 'next/server';
import { canResume, RESUME_BLOCKED_REASON } from '@/features/stop-list/model/stop-rules';
import { jsonError } from '@/server/http';
import { getMenuItem, resumeMenuItem } from '@/server/menu-store';
import { simulateNetwork } from '@/server/mock-network';

export async function POST(
  _request: NextRequest,
  ctx: RouteContext<'/api/menu-items/[id]/resume'>,
) {
  const { id } = await ctx.params;

  const item = getMenuItem(id);
  if (!item) {
    return jsonError(404, { error: 'Позиция не найдена' });
  }
  if (!canResume(item)) {
    return jsonError(409, { error: RESUME_BLOCKED_REASON });
  }

  if (await simulateNetwork('mutation')) {
    return jsonError(500, { error: 'Сервер не ответил, попробуйте ещё раз' });
  }

  return Response.json(resumeMenuItem(id));
}
