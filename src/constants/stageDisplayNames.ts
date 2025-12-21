import type { StageId } from '../stores/useGameStore';

export const STAGE_DISPLAY_NAMES: Record<StageId, string> = {
  stage0: 'シティ',
  stage1: 'バグ',
  stage2: '迷路 (ランダム生成)',
  stageL: 'メトロポリス',
};

export function getStageDisplayName(stageId: StageId): string {
  return STAGE_DISPLAY_NAMES[stageId] ?? stageId;
}
