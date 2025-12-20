import { useCallback, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useGameStore from '../../stores/useGameStore';

const COOLDOWN_TIME = 10; // 10秒のクールタイム
const SPOT_RADIUS = 2; // 半径2メートル

type ResetSpotProps = {
  position?: [number, number, number];
};

export default function ResetSpot({ position = [0, 0.1, 0] }: ResetSpotProps) {
  const triggerItemReset = useGameStore((s) => s.triggerItemReset);
  const [cooldown, setCooldown] = useState(0);
  const meshRef = useRef<THREE.Mesh>(null);

  // クールタイムのカウントダウン
  useFrame((_, delta) => {
    if (cooldown > 0) {
      setCooldown((prev) => Math.max(0, prev - delta));
    }

    // 光のパルスアニメーション
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const time = Date.now() * 0.001;
      const isActive = cooldown === 0;

      if (isActive) {
        // アクティブ時：白く光る
        const pulse = 0.7 + Math.sin(time * 3) * 0.3;
        material.opacity = pulse;
      } else {
        // クールタイム中：暗く
        material.opacity = 0.2;
      }
    }
  });

  const handleEnter = useCallback(
    ({ other }: { other: { rigidBodyObject?: { name?: string } } }) => {
      // クールタイム中は無効
      if (cooldown > 0) return;

      // プレイヤーのみ反応
      if (other.rigidBodyObject?.name !== 'player') return;

      // リセット実行
      triggerItemReset();

      // クールタイム開始
      setCooldown(COOLDOWN_TIME);
    },
    [cooldown, triggerItemReset]
  );

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider
        args={[SPOT_RADIUS, 0.1, SPOT_RADIUS]}
        sensor
        onIntersectionEnter={handleEnter}
      />

      {/* 光る床 */}
      <mesh ref={meshRef} rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <circleGeometry args={[SPOT_RADIUS, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* クールタイム表示用のリング */}
      {cooldown > 0 && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 0]}>
          <ringGeometry args={[SPOT_RADIUS - 0.1, SPOT_RADIUS, 32]} />
          <meshBasicMaterial color="#ff4444" transparent opacity={0.6} />
        </mesh>
      )}
    </RigidBody>
  );
}
