import { z } from 'zod';
import type { MenuItemStatusKind, Shop } from '@/types/menu';

export const SHOPS = ['kitchen', 'bar', 'pastry'] as const satisfies readonly Shop[];
export const STATUS_KINDS = ['available', 'stopped'] as const satisfies readonly MenuItemStatusKind[];

export const SHOP_LABELS: Record<Shop, string> = {
  kitchen: 'Кухня',
  bar: 'Бар',
  pastry: 'Кондитерская',
};

export const STATUS_LABELS: Record<MenuItemStatusKind, string> = {
  available: 'В продаже',
  stopped: 'В стоп-листе',
};

const filtersSchema = z.object({
  shop: z.enum(SHOPS).optional().catch(undefined),
  status: z.enum(STATUS_KINDS).optional().catch(undefined),
});

export type StopListFilters = z.infer<typeof filtersSchema>;

type SearchParamsSource = URLSearchParams | Record<string, string | string[] | undefined>;

export function parseFilters(source: SearchParamsSource): StopListFilters {
  const read = (key: string) => {
    const value = source instanceof URLSearchParams ? source.get(key) : source[key];
    return Array.isArray(value) ? value[0] : (value ?? undefined);
  };
  return filtersSchema.parse({ shop: read('shop'), status: read('status') });
}

export function filtersToSearch(filters: StopListFilters): string {
  const params = new URLSearchParams();
  if (filters.shop) params.set('shop', filters.shop);
  if (filters.status) params.set('status', filters.status);
  const query = params.toString();
  return query ? `?${query}` : '';
}