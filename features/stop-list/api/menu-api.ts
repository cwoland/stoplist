import { postJson, request } from '@/shared/api/request';
import type { MenuItem, StopItemPayload } from '@/types/menu';
import { filtersToSearch, type StopListFilters } from '../model/filters';

const BASE_URL = '/api/menu-items';

export function fetchMenuItems(filters: StopListFilters): Promise<MenuItem[]> {
  return request<MenuItem[]>(`${BASE_URL}${filtersToSearch(filters)}`);
}

export function stopMenuItem(id: string, payload: StopItemPayload): Promise<MenuItem> {
  return postJson<MenuItem>(`${BASE_URL}/${id}/stop`, payload);
}

export function resumeMenuItem(id: string): Promise<MenuItem> {
  return postJson<MenuItem>(`${BASE_URL}/${id}/resume`);
}
