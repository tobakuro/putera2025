import { create } from 'zustand';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

export type StageId = 'stage0' | 'stage1';

type State = {
  // ゲーム状態
  gameState: GameState;
  setGameState: (state: GameState) => void;

  // ステージ選択
  stageId: StageId;
  setStageId: (stageId: StageId) => void;

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

  // カギ
  keysCollected: number;
  totalKeys: number;
  setTotalKeys: (total: number) => void;
  collectKey: () => void;
  resetKeys: () => void;

  // ゲームリセット
  resetGame: (preserveStage?: boolean) => void;
  // リスポーン制御: トークンをインクリメントしてプレイヤーに通知
  respawnToken: number;
  requestRespawn: () => void;
};

const INITIAL_STATE = {
  gameState: 'menu' as GameState,
  stageId: 'stage0' as StageId,
  score: 0,
  playerHP: 100,
  maxHP: 100,
  currentAmmo: 30,
  maxAmmo: 30,
  reserveAmmo: 90,
  keysCollected: 0,
  totalKeys: 1,
};

// デフォルトステージID（型安全に参照するため）
const DEFAULT_STAGE_ID: StageId = 'stage0';

export const useGameStore = create<State>((set) => ({
  ...INITIAL_STATE,

  // ゲーム状態
  setGameState: (gameState) => set({ gameState }),

  // ステージ選択
  setStageId: (stageId) => set({ stageId }),

  // スコア
  addScore: (n) => set((s) => ({ score: s.score + n })),
  resetScore: () => set({ score: 0 }),

  // プレイヤーHP
  takeDamage: (damage) =>
    set((s) => {
      const newHP = Math.max(0, s.playerHP - damage);
      return {
        playerHP: newHP,
        gameState: newHP <= 0 ? 'gameover' : s.gameState,
      } as Partial<State>;
    }),
  heal: (amount) =>
    set((s) => ({
      playerHP: Math.min(s.maxHP, s.playerHP + amount),
    })),

  // 弾薬
  shoot: () => {
    let fired = false;
    set((s) => {
      if (s.currentAmmo > 0) {
        fired = true;
        return { currentAmmo: s.currentAmmo - 1 } as Partial<State>;
      }
      return {} as Partial<State>;
    });
    return fired;
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

  // カギ
  setTotalKeys: (total) =>
    set((s) => {
      const clampedTotal = Math.max(0, total);
      return {
        totalKeys: clampedTotal,
        keysCollected: Math.min(s.keysCollected, clampedTotal),
      } as Partial<State>;
    }),
  collectKey: () =>
    set((s) => ({
      keysCollected: Math.min(s.totalKeys, s.keysCollected + 1),
    })),
  resetKeys: () => set({ keysCollected: 0 }),

  // ゲームリセット
  // preserveStage=true の場合は現在の stageId を保持してリセットする
  resetGame: (preserveStage = false) =>
    set((s) => {
      const stageId = preserveStage ? s.stageId : DEFAULT_STAGE_ID;
      return { ...INITIAL_STATE, stageId } as State;
    }),
  // リスポーン: トークンを増やしHPを全回復する
  respawnToken: 0,
  requestRespawn: () =>
    set((s) => ({ respawnToken: s.respawnToken + 1, playerHP: s.maxHP }) as Partial<State>),
}));

export default useGameStore;
