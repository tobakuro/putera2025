import { create } from 'zustand';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

type State = {
  // ゲーム状態
  gameState: GameState;
  setGameState: (state: GameState) => void;

  // スコア
  score: number;
  addScore: (n: number) => void;
  resetScore: () => void;

  // プレイヤー状態
  playerHP: number;
  maxHP: number;
  takeDamage: (damage: number) => void;
  heal: (amount: number) => void;

  // 弾薬
  currentAmmo: number;
  maxAmmo: number;
  reserveAmmo: number;
  shoot: () => boolean; // 射撃成功したらtrue
  reload: () => void;

  // ゲームリセット
  resetGame: () => void;
};

const INITIAL_STATE = {
  gameState: 'menu' as GameState,
  score: 0,
  playerHP: 100,
  maxHP: 100,
  currentAmmo: 30,
  maxAmmo: 30,
  reserveAmmo: 90,
};

export const useGameStore = create<State>((set, get) => ({
  ...INITIAL_STATE,

  // ゲーム状態
  setGameState: (gameState) => set({ gameState }),

  // スコア
  addScore: (n) => set((s) => ({ score: s.score + n })),
  resetScore: () => set({ score: 0 }),

  // プレイヤーHP
  takeDamage: (damage) =>
    set((s) => ({
      playerHP: Math.max(0, s.playerHP - damage),
      gameState: s.playerHP - damage <= 0 ? 'gameover' : s.gameState,
    })),
  heal: (amount) =>
    set((s) => ({
      playerHP: Math.min(s.maxHP, s.playerHP + amount),
    })),

  // 弾薬
  shoot: () => {
    const { currentAmmo } = get();
    if (currentAmmo > 0) {
      set((s) => ({ currentAmmo: s.currentAmmo - 1 }));
      return true;
    }
    return false;
  },
  reload: () =>
    set((s) => {
      const needed = s.maxAmmo - s.currentAmmo;
      const available = Math.min(needed, s.reserveAmmo);
      return {
        currentAmmo: s.currentAmmo + available,
        reserveAmmo: s.reserveAmmo - available,
      };
    }),

  // ゲームリセット
  resetGame: () => set(INITIAL_STATE),
}));

export default useGameStore;
