import type { StageId } from '../stores/useGameStore';

export const STAGE_SCALE: Record<StageId, number> = {
  stage0: 1,
  stage1: 3,
};

export const STAGE_SPAWN: Record<StageId, [number, number, number]> = {
  stage0: [0, 5, 0],
  stage1: [0, 8, 10],
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
};
