import type { StageId } from '../stores/useGameStore';

export const STAGE_SCALE: Record<StageId, number> = {
  stage0: 1,
  stage1: 3,
  stage2: 1,
  // 新ステージ: メトロポリス（stage_L.glb）
  stageL: 3,
};

export const STAGE_SPAWN: Record<StageId, [number, number, number]> = {
  stage0: [0, 0.1, 0],
  stage1: [-8, 0.1, 13],
  stage2: [-30, 0.1, -30],
  // メトロポリスのデフォルトスポーン（必要に応じて調整）
  stageL: [0, 0.1, 0],
};

// Reset spot positions per stage. If a stage is not present here, no reset spot will be shown.
export const RESET_SPOTS: Partial<Record<StageId, [number, number, number]>> = {
  stage0: [2.8, 0.1, -6],
  stage1: [6, 0.1, 18],
  stageL: [31, 0.1, -31],
};

// 敵のスポーン地点（各ステージに複数の候補位置）
export const ENEMY_SPAWN_POINTS: Record<StageId, [number, number, number][]> = {
  stage0: [
    [10, 2, 10],
    [-10, 2, 10],
    [10, 2, -10],
    [-10, 2, -10],
    [15, 2, 0],
    [-15, 2, 0],
    [0, 2, 15],
    [0, 2, -15],
  ],
  stage1: [
    [15, 5, 15],
    [-15, 5, 15],
    [15, 5, -15],
    [-15, 5, -15],
    [20, 5, 0],
    [-20, 5, 0],
  ],
  stage2: [
    // ← 追加（迷路内のランダムな位置）
    [0, 2, 0],
    [20, 2, 20],
    [-20, 2, -20],
    [30, 2, -30],
  ],
  // メトロポリス用の簡易スポーンポイント（初期値）
  stageL: [
    [10, 5, 10],
    [-10, 5, 10],
    [10, 5, -10],
    [-10, 5, -10],
  ],
};
