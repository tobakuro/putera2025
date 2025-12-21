import type { State } from '../useGameStore';
import type { StoreApi } from 'zustand';

type SetStateType = StoreApi<State>['setState'];

export const createCameraSlice = (set: SetStateType): Partial<State> => ({
  // デフォルトを一人称に変更
  cameraMode: 'first',
  setCameraMode: (mode: 'third' | 'first') => set({ cameraMode: mode }),
  toggleCameraMode: () =>
    set((s: State) => ({ cameraMode: s.cameraMode === 'third' ? 'first' : 'third' })),
});

export default createCameraSlice;
