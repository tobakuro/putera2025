import type { StageId } from '../stores/useGameStore';
import { STAGE_SCALE } from './stages';

// 各ステージごとのゴール座標（ワールド空間）。
// ここでは既存の座標や適切なデフォルトを配置します。
// 注意: Stage1/StageL はモデルにスケールがかかるため、KeyholeGoal 側で STAGE_SCALE を
// 参照して乗算して使います。
export const GOAL_POSITIONS: Record<StageId, [number, number, number]> = {
  // 既存デフォルトステージ
  stage0: [26, 1.5, 24],
  // stage1 のモデル内で手前〜奥のあたりに配置（小さい調整可）
  stage1: [-27, 1.5, -23],
  // 迷路ステージ（既存のハードコーディング値を保持）
  stage2: [36.1, 1.5, 36.0],
  // 大きいステージはスケールが3なので、見やすい位置に配置
  stageL: [10, 3, 10],
};

export function getScaledGoalPosition(stageId: StageId): [number, number, number] {
  const p = GOAL_POSITIONS[stageId] ?? [0, 1.5, 0];
  const scale = STAGE_SCALE[stageId] ?? 1;
  if (stageId === 'stage1') {
    // Stage1 はスケール済みモデル上でワールド座標を直接指定する
    return p;
  }
  return [p[0] * scale, p[1] * scale, p[2] * scale];
}
