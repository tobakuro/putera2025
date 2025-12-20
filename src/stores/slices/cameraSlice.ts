import type { State } from '../useGameStore';

// Minimal local typings to avoid depending on zustand's exported helper types
type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;

export const createCameraSlice = (set: SetState<State>): Partial<State> => ({
  cameraMode: 'third',
  setCameraMode: (mode: 'third' | 'first') => set({ cameraMode: mode }),
  toggleCameraMode: () =>
    set((s: State) => ({ cameraMode: s.cameraMode === 'third' ? 'first' : 'third' })),
});

export default createCameraSlice;
