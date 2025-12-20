import type { StageId } from '../../../stores/useGameStore';
import { STAGE_SCALE } from '../../../constants/stages';

/**
 * 既存の `STAGE_SCALE` を再利用する軽量ラッパー。
 * 既存の設定を一元化しておきたいコードがまだこのファイルを参照している可能性があるため
 * 互換性を保つために残しておきます。
 */
export type StageSettings = {
  scale: number;
};

export function getStageSettings(stageId: StageId): StageSettings {
  return { scale: STAGE_SCALE[stageId] };
}
