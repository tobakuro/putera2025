import type { State } from '../useGameStore';
import type { StoreApi } from 'zustand';

type SetStateType = StoreApi<State>['setState'];

export const createEnemiesSlice = (set: SetStateType): Partial<State> => ({
  enemies: [] as State['enemies'],
  addEnemy: (enemy: State['enemies'][number]) =>
    set((s: State) => ({ enemies: [...s.enemies, enemy] })),
  removeEnemy: (id: string) =>
    set((s: State) => ({ enemies: s.enemies.filter((e) => e.id !== id) })),
  updateEnemyHealth: (id: string, health: number) =>
    set((s: State) => ({ enemies: s.enemies.map((e) => (e.id === id ? { ...e, health } : e)) })),
  updateEnemyPosition: (id: string, position: [number, number, number]) =>
    set((s: State) => ({ enemies: s.enemies.map((e) => (e.id === id ? { ...e, position } : e)) })),
  clearEnemies: () => set({ enemies: [] }),
});

export default createEnemiesSlice;
