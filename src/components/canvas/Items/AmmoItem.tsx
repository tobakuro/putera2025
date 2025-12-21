import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, BallCollider, interactionGroups } from '@react-three/rapier';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import {
  AMMO_MODEL_PATH,
  AMMO_SCALE,
  AMMO_ROTATION_SPEED,
  AMMO_BOB_SPEED,
  AMMO_BOB_HEIGHT,
  AMMO_RESTORE_AMOUNT,
  AMMO_COLLIDER_RADIUS,
} from '../../../constants/items';
import { MAX_RESERVE_AMMO } from '../../../constants/weapons';
import useGameStore from '../../../stores/useGameStore';

type AmmoItemProps = {
  id: string;
  position: THREE.Vector3;
  onCollect: (id: string) => void;
};

export default function AmmoItem({ id, position, onCollect }: AmmoItemProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const visualRef = useRef<THREE.Group>(null);
  const startTimeRef = useRef<number | null>(null);

  const { scene } = useGLTF(AMMO_MODEL_PATH) as { scene: THREE.Group };
  const cloned = useMemo(() => scene.clone(), [scene]);

  const gameState = useGameStore((s) => s.gameState);
  const reserveAmmo = useGameStore((s) => s.reserveAmmo);

  // アイテムの回転とボビング（上下運動）アニメーション
  useFrame((state) => {
    if (gameState !== 'playing') return;
    if (!visualRef.current) return;

    // 初回実行時に開始時刻を記録
    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current;

    // Y軸回転
    visualRef.current.rotation.y = elapsed * AMMO_ROTATION_SPEED;

    // 上下運動
    const bobOffset = Math.sin(elapsed * AMMO_BOB_SPEED) * AMMO_BOB_HEIGHT;
    visualRef.current.position.y = bobOffset;
  });

  // プレイヤーとの衝突検出
  const handleCollision = ({ other }: { other: { rigidBodyObject?: { userData?: unknown } } }) => {
    const ud = other?.rigidBodyObject?.userData;
    const udObj = ud && typeof ud === 'object' ? (ud as Record<string, unknown>) : null;

    // プレイヤーに当たった場合
    if (udObj?.type === 'player') {
      // 予備弾が最大でない場合のみ回収可能
      if (reserveAmmo < MAX_RESERVE_AMMO) {
        // 予備弾を補充（最大値を超えないように）
        const newReserveAmmo = Math.min(reserveAmmo + AMMO_RESTORE_AMOUNT, MAX_RESERVE_AMMO);
        useGameStore.setState({ reserveAmmo: newReserveAmmo });

        // アイテムを削除
        onCollect(id);
      }
    }
  };

  return (
    <RigidBody
      ref={bodyRef}
      type="fixed"
      position={[position.x, position.y, position.z]}
      colliders={false} // 手動でコライダーを設定
      sensor={true} // センサーとして機能（物理的に干渉しない）
      collisionGroups={interactionGroups(4, [1])} // グループ4（アイテム）: プレイヤーのみと衝突検出
      onIntersectionEnter={handleCollision}
    >
      {/* 取得判定用の大きめのコライダー */}
      <BallCollider args={[AMMO_COLLIDER_RADIUS]} sensor />

      {/* 視覚表示 */}
      <group ref={visualRef} scale={[AMMO_SCALE, AMMO_SCALE, AMMO_SCALE]}>
        <primitive object={cloned} />
      </group>
    </RigidBody>
  );
}

// preload model
useGLTF.preload(AMMO_MODEL_PATH);
