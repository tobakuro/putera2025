import { create } from 'zustand';
import { createGameSlice } from './slices/gameSlice';
import { createCameraSlice } from './slices/cameraSlice';
import { createPlayerSlice } from './slices/playerSlice';
import { createAmmoSlice } from './slices/ammoSlice';
import { createKeysSlice } from './slices/keysSlice';
import { createEnemiesSlice } from './slices/enemiesSlice';
import type { EnemyType } from '../constants/enemies';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

export type StageId = 'stage0' | 'stage1';

// 敵の個体情報
export interface Enemy {
  id: string;
  type: EnemyType;
  health: number;
  position: [number, number, number];
}

export type State = {
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

  // 敵管理
  enemies: Enemy[];
  addEnemy: (enemy: Enemy) => void;
  removeEnemy: (id: string) => void;
  updateEnemyHealth: (id: string, health: number) => void;
  updateEnemyPosition: (id: string, position: [number, number, number]) => void;
  clearEnemies: () => void;
  // アイテムリセットトリガー（リセットスポット用）
  itemResetTrigger: number;
  triggerItemReset: () => void;

  // ゲームリセット
  resetGame: (preserveStage?: boolean) => void;
  // リスポーン制御: トークンをインクリメントしてプレイヤーに通知
  respawnToken: number;
  requestRespawn: () => void;
  // カメラモード: 'third' | 'first'
  cameraMode: 'third' | 'first';
  setCameraMode: (mode: 'third' | 'first') => void;
  toggleCameraMode: () => void;
};

export const useGameStore = create<State>(
  (set, get) =>
    ({
      ...createGameSlice(set, get),
      ...createCameraSlice(set, get),
      ...createPlayerSlice(set, get),
      ...createAmmoSlice(set, get),
      ...createKeysSlice(set, get),
      ...createEnemiesSlice(set, get),
    }) as unknown as State
);

export default useGameStore;
