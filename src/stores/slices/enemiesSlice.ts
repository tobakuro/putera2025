import type { State } from '../useGameStore';

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;

export const createEnemiesSlice = (set: SetState<State>): Partial<State> => ({
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
