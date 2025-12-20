import type { State } from '../useGameStore';

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;

export const createAmmoSlice = (set: SetState<State>): Partial<State> => ({
  currentAmmo: 30,
  maxAmmo: 30,
  reserveAmmo: 90,
  shoot: () => {
    let fired = false;
    set((s: State) => {
      if (s.currentAmmo > 0) {
        fired = true;
        return { currentAmmo: s.currentAmmo - 1 };
      }
      return {} as Partial<State>;
    });
    return fired;
  },
  reload: () =>
    set((s: State) => {
      const needed = s.maxAmmo - s.currentAmmo;
      const available = Math.min(needed, s.reserveAmmo);
      return {
        currentAmmo: s.currentAmmo + available,
        reserveAmmo: s.reserveAmmo - available,
      } as Partial<State>;
    }),
});

export default createAmmoSlice;
