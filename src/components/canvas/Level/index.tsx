import { RigidBody } from '@react-three/rapier';
import { Model as Stage0Model } from '../../models/levels/Stage';
import { Model as Stage1Model } from '../../models/levels/Stage1';
import useGameStore from '../../../stores/useGameStore';
import { STAGE_SCALE } from '../../../constants/stages';

export default function Level() {
  const stageId = useGameStore((s) => s.stageId);
  const scale = STAGE_SCALE[stageId] ?? 1;

  return (
    // type="fixed": 動かない物体
    // colliders="trimesh": 複雑な地形（階段など）に合わせて当たり判定を作る設定
    <RigidBody type="fixed" colliders="trimesh">
      {stageId === 'stage1' ? <Stage1Model scale={scale} /> : <Stage0Model scale={scale} />}
    </RigidBody>
  );
}
