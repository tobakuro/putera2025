import type { State } from '../useGameStore';
import type { StoreApi } from 'zustand';
import { INITIAL_CURRENT_AMMO, MAX_AMMO, INITIAL_RESERVE_AMMO } from '../../constants/weapons';

type SetStateType = StoreApi<State>['setState'];

export const createAmmoSlice = (set: SetStateType): Partial<State> => ({
  currentAmmo: INITIAL_CURRENT_AMMO,
  maxAmmo: MAX_AMMO,
  reserveAmmo: INITIAL_RESERVE_AMMO,
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
