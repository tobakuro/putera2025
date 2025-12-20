import type { State } from '../useGameStore';

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;

export const createKeysSlice = (set: SetState<State>): Partial<State> => ({
  keysCollected: 0,
  totalKeys: 1,
  setTotalKeys: (total: number) =>
    set((s: State) => ({
      totalKeys: Math.max(0, total),
      keysCollected: Math.min(s.keysCollected, Math.max(0, total)),
    })),
  collectKey: () =>
    set((s: State) => ({ keysCollected: Math.min(s.totalKeys, s.keysCollected + 1) })),
  resetKeys: () => set({ keysCollected: 0 }),
  itemResetTrigger: 0,
  triggerItemReset: () =>
    set((s: State) => ({ itemResetTrigger: s.itemResetTrigger + 1, keysCollected: 0 })),
});

export default createKeysSlice;
