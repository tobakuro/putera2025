import { RigidBody } from '@react-three/rapier';
import { Model as StageModel } from '../../models/levels/Stage'; // 生成したモデルをインポート

export default function Level() {
  return (
    // type="fixed": 動かない物体
    // colliders="trimesh": 複雑な地形（階段など）に合わせて当たり判定を作る設定
    <RigidBody type="fixed" colliders="trimesh">
      <StageModel />
    </RigidBody>
  );
}
