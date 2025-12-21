import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, interactionGroups, BallCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import {
  ENEMY_BULLET_SPEED,
  ENEMY_BULLET_LIFETIME,
  ENEMY_BULLET_SCALE,
} from '../../../constants/weapons';
import useGameStore from '../../../stores/useGameStore';

type EnemyBulletProps = {
  id: number;
  startPosition: THREE.Vector3;
  direction: THREE.Vector3;
  createdAt: number;
  damage: number;
  onExpire: (id: number) => void;
};

export default function EnemyBullet({
  id,
  startPosition,
  direction,
  createdAt,
  damage,
  onExpire,
}: EnemyBulletProps) {
  const bulletRef = useRef<RapierRigidBody>(null);
  const hasAppliedVelocity = useRef(false);
  const [hasHit, setHasHit] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const takeDamage = useGameStore((s) => s.takeDamage);
  const gameState = useGameStore((s) => s.gameState);

  const MODEL_PATH = '/models/3D/glb/dangan/dangan.glb';
  const { scene } = useGLTF(MODEL_PATH) as { scene: THREE.Group };
  const cloned = useMemo(() => scene.clone(), [scene]);
  const { camera } = useThree();
  const visualRef = useRef<THREE.Group | null>(null);

  // 衝突（壁/地形/プレイヤー）を検出
  const handleCollision = ({ other }: { other: { rigidBodyObject?: { userData?: unknown } } }) => {
    if (hasHit) return;

    const ud = other?.rigidBodyObject?.userData;
    const udObj = ud && typeof ud === 'object' ? (ud as Record<string, unknown>) : null;

    // プレイヤーに当たった場合
    if (udObj?.type === 'player') {
      takeDamage(damage, 'Enemy:sniper:bullet', Date.now() / 1000);
    }

    setHasHit(true);
  };

  // RigidBodyが準備できていることを保証するためにuseFrame内で速度を適用
  useFrame((state) => {
    if (gameState !== 'playing') return;
    if (!bulletRef.current || hasHit || isExpired) return;

    // 寿命チェック
    const now = state.clock.getElapsedTime();
    if (now - createdAt > ENEMY_BULLET_LIFETIME) {
      setIsExpired(true);
      return;
    }

    // 一度だけ速度を適用
    if (!hasAppliedVelocity.current) {
      const velocity = direction.clone().multiplyScalar(ENEMY_BULLET_SPEED);
      bulletRef.current.setLinvel(velocity, true);
      hasAppliedVelocity.current = true;
    }

    // 毎フレーム、モデルの底面がカメラを向くように回転を設定する
    const vis = visualRef.current;
    if (vis) {
      const worldPos = new THREE.Vector3();
      vis.getWorldPosition(worldPos);
      const toCam = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
      const fromVec = new THREE.Vector3(0, -1, 0);
      const q = new THREE.Quaternion().setFromUnitVectors(fromVec, toCam);
      vis.quaternion.slerp(q, 0.3);
    }
  });

  // 弾が当たったか寿命切れの場合、useEffectで削除
  useEffect(() => {
    if (hasHit || isExpired) {
      onExpire(id);
    }
  }, [hasHit, isExpired, id, onExpire]);

  // 弾が当たったか寿命切れの場合は表示しない
  if (hasHit || isExpired) {
    return null;
  }

  return (
    <RigidBody
      ref={bulletRef}
      colliders={false} // 手動でコライダーを設定
      mass={0.01}
      position={[startPosition.x, startPosition.y, startPosition.z]}
      gravityScale={0}
      ccd={true} // 高速移動物体のための連続衝突検出
      sensor={false} // センサーではない - 弾はオブジェクトと衝突する
      linearDamping={0} // 空気抵抗なし
      angularDamping={0} // 回転減衰なし
      collisionGroups={interactionGroups(3, [0, 1])} // グループ3（敵の弾丸）: 地形・プレイヤーと衝突、敵とは衝突しない
      onCollisionEnter={handleCollision}
    >
      {/* スケールに合わせた球コライダー */}
      <BallCollider args={[ENEMY_BULLET_SCALE * 0.5]} />

      {/* visualRef を使って毎フレームカメラ方向に底面を向ける */}
      <group ref={visualRef} scale={[ENEMY_BULLET_SCALE, ENEMY_BULLET_SCALE, ENEMY_BULLET_SCALE]}>
        <primitive object={cloned} />
      </group>
    </RigidBody>
  );
}

// preload model for smoother first render
useGLTF.preload('/models/3D/glb/dangan/dangan.glb');
