import type { StageId } from '../../../stores/useGameStore';

/**
 * ステージ設定。
 * scale=1 が「今の大きさ」を意味します。
 */
export type StageSettings = {
  /**
   * ステージ全体のスケール。
   * 例: 2.0 にすると縦横奥行きが2倍。
   */
  scale: number;
};

export const STAGE_SETTINGS: Record<StageId, StageSettings> = {
  stage0: {
    scale: 1,
  },
  stage1: {
    scale: 1,
  },
};

export function getStageSettings(stageId: StageId): StageSettings {
  return STAGE_SETTINGS[stageId];
}
