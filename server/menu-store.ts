import type { MenuItem, StopItemPayload } from '@/types/menu';
import type { StopListFilters } from '@/features/stop-list/model/filters';
import { createSeed } from './menu-seed';

type MenuStore = Map<string, MenuItem>;

const globalRef = globalThis as typeof globalThis & { __menuStore?: MenuStore };

function getStore(): MenuStore {
  globalRef.__menuStore ??= new Map(createSeed().map((item) => [item.id, item]));
  return globalRef.__menuStore;
}

export function listMenuItems(filters: StopListFilters): MenuItem[] {
  return [...getStore().values()].filter(
    (item) =>
      (!filters.shop || item.shop === filters.shop) &&
      (!filters.status || item.status.kind === filters.status),
  );
}

export function getMenuItem(id: string): MenuItem | undefined {
  return getStore().get(id);
}

export function stopMenuItem(id: string, payload: StopItemPayload): MenuItem {
  return patchMenuItem(id, { status: { kind: 'stopped', ...payload } });
}

export function resumeMenuItem(id: string): MenuItem {
  return patchMenuItem(id, { status: { kind: 'available' } });
}

function patchMenuItem(id: string, patch: Pick<MenuItem, 'status'>): MenuItem {
  const store = getStore();
  const current = store.get(id);
  if (!current) throw new Error(`Menu item ${id} not found`);
  const next: MenuItem = { ...current, ...patch, updatedAt: new Date().toISOString() };
  store.set(id, next);
  return next;
}
