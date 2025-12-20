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

  // プレイヤー座標
  playerPosition: { x: number; y: number; z: number };
  setPlayerPosition: (position: { x: number; y: number; z: number }) => void;

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

  // アイテムリセットトリガー（リセットスポット用）
  itemResetTrigger: number;
  triggerItemReset: () => void;

  // ゲームリセット
  resetGame: (preserveStage?: boolean) => void;
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
  itemResetTrigger: 0,
  playerPosition: { x: 0, y: 0, z: 0 },
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
  // プレイヤー座標
  setPlayerPosition: (position) => set({ playerPosition: position }),
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

  // アイテムリセットトリガー
  triggerItemReset: () =>
    set((s) => ({
      itemResetTrigger: s.itemResetTrigger + 1,
      keysCollected: 0, // 鍵の入手数もリセット
    })),

  // ゲームリセット
  // preserveStage=true の場合は現在の stageId を保持してリセットする
  resetGame: (preserveStage = false) =>
    set((s) => {
      const stageId = preserveStage ? s.stageId : DEFAULT_STAGE_ID;
      return { ...INITIAL_STATE, stageId } as State;
    }),
}));

export default useGameStore;
