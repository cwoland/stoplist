import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { fetchMenuItems } from '../api/menu-api';
import type { StopListFilters } from './filters';

export const menuKeys = {
  all: ['menu-items'] as const,
  lists: () => [...menuKeys.all, 'list'] as const,
  list: (filters: StopListFilters) => [...menuKeys.lists(), filters] as const,
  mutations: () => [...menuKeys.all, 'mutation'] as const,
  mutation: (name: 'stop' | 'resume') => [...menuKeys.mutations(), name] as const,
};

export function menuItemsQueryOptions(filters: StopListFilters) {
  return queryOptions({
    queryKey: menuKeys.list(filters),
    queryFn: () => fetchMenuItems(filters),
    placeholderData: keepPreviousData,
  });
}
