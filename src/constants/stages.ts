import type { StageId } from '../stores/useGameStore';

export const STAGE_SCALE: Record<StageId, number> = {
  stage0: 1,
  stage1: 3,
};

export const STAGE_SPAWN: Record<StageId, [number, number, number]> = {
  stage0: [0, 5, 0],
  stage1: [0, 8, 10],
};
