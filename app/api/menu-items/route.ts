import type { NextRequest } from 'next/server';
import { parseFilters } from '@/features/stop-list/model/filters';
import { jsonError } from '@/server/http';
import { listMenuItems } from '@/server/menu-store';
import { simulateNetwork } from '@/server/mock-network';

export async function GET(request: NextRequest) {
  if (await simulateNetwork('query')) {
    return jsonError(503, { error: 'Не удалось загрузить меню смены' });
  }
  const filters = parseFilters(request.nextUrl.searchParams);
  return Response.json(listMenuItems(filters));
}
