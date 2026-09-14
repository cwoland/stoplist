import { create } from 'zustand';
import type { MenuItem } from '@/types/menu';

export type StopPanelMode = 'create' | 'edit';

interface StopPanelState {
  itemId: string | null;
  mode: StopPanelMode;
  open: (item: MenuItem) => void;
  close: () => void;
}

export const useStopPanelStore = create<StopPanelState>()((set) => ({
  itemId: null,
  mode: 'create',
  open: (item) =>
    set({ itemId: item.id, mode: item.status.kind === 'stopped' ? 'edit' : 'create' }),
  close: () => set({ itemId: null }),
}));
