import type { State } from '../useGameStore';
import type { StoreApi } from 'zustand';

type SetStateType = StoreApi<State>['setState'];

export const createPlayerSlice = (set: SetStateType): Partial<State> => ({
  playerPosition: { x: 0, y: 0, z: 0 },
  setPlayerPosition: (position: { x: number; y: number; z: number }) =>
    set({ playerPosition: position }),

  respawnToken: 0,
  requestRespawn: () =>
    set((s: State) => ({ respawnToken: s.respawnToken + 1, playerHP: s.maxHP })),
});

export default createPlayerSlice;
