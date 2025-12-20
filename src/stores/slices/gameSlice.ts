import type { State } from '../useGameStore';
import type { StoreApi } from 'zustand';

type SetStateType = StoreApi<State>['setState'];

export const createGameSlice = (set: SetStateType): Partial<State> => ({
  gameState: 'menu',
  setGameState: (gameState: 'menu' | 'playing' | 'paused' | 'gameover') => set({ gameState }),

  stageId: 'stage0',
  setStageId: (stageId: 'stage0' | 'stage1' | 'stageL') =>
    set({ stageId, keysCollected: 0, totalKeys: 0 }),

  // level は 1..4 の整数
  level: 1,
  setLevel: (level: number) => set(() => ({ level: Math.max(1, Math.min(4, Math.floor(level))) })),

  score: 0,
  addScore: (n: number) => set((s: State) => ({ score: s.score + n })),
  resetScore: () => set({ score: 0 }),

  playerHP: 100,
  maxHP: 100,
  takeDamage: (damage: number, reason?: string, time?: number) =>
    set((s: State) => {
      const newHP = Math.max(0, s.playerHP - damage);
      const isDead = newHP <= 0;
      return {
        playerHP: newHP,
        gameState: isDead ? 'gameover' : s.gameState,
        // 死亡時の情報を保存
        deathReason: isDead ? (reason ?? 'Unknown') : (s.deathReason ?? null),
        deathTime: isDead ? (time ?? null) : (s.deathTime ?? null),
        deathKeys: isDead ? (s.keysCollected ?? 0) : (s.deathKeys ?? null),
      } as Partial<State>;
    }),
  heal: (amount: number) =>
    set((s: State) => ({ playerHP: Math.min(s.maxHP, s.playerHP + amount) })),

  resetGame: (preserveStage = false) => {
    const DEFAULT_STAGE_ID = 'stage0';
    set(
      (s: State) =>
        ({
          gameState: 'menu',
          stageId: preserveStage ? s.stageId : DEFAULT_STAGE_ID,
          score: 0,
          playerHP: 100,
          maxHP: 100,
          currentAmmo: 30,
          maxAmmo: 30,
          reserveAmmo: 90,
          keysCollected: 0,
          totalKeys: 1,
          enemies: [],
          itemResetTrigger: 0,
          playerPosition: { x: 0, y: 0, z: 0 },
          lastKeySpawns: [],
          lastHeartSpawns: [],
          respawnToken: 0,
          deathReason: null,
          deathTime: null,
          deathKeys: null,
          cameraMode: 'third',
        }) as Partial<State>
    );
  },
});

export default createGameSlice;
