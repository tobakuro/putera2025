import { useCallback, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useGameStore from '../../stores/useGameStore';

const COOLDOWN_TIME = 10;
const SPOT_RADIUS = 2;

type ResetSpotProps = {
  position?: [number, number, number];
};

export default function ResetSpot({ position = [0, 0.1, 0] }: ResetSpotProps) {
  const triggerItemReset = useGameStore((s) => s.triggerItemReset);
  const [cooldown, setCooldown] = useState(0);

  // 全体の回転用（看板のような左右回転）
  const billboardRef = useRef<THREE.Group>(null);
  // マーク自体の自転用（矢印の向きへの回転）
  const iconRef = useRef<THREE.Group>(null);

  const isActive = cooldown === 0;
  const statusColor = isActive ? '#00ff88' : '#ff4444';

  useFrame((state, delta) => {
    if (useGameStore.getState().gameState !== 'playing') return;

    if (cooldown > 0) {
      setCooldown((prev) => Math.max(0, prev - delta));
    }

    const t = state.clock.getElapsedTime();
    const speedMultiplier = isActive ? 1.0 : 0.2;

    // 1. 全体の左右回転（billboard回転）
    if (billboardRef.current) {
      billboardRef.current.rotation.y += delta * 1.2 * speedMultiplier;
      billboardRef.current.position.y = Math.sin(t * 2) * 0.1 + 1.3;
    }

    // 2. アイコン自体の自転（矢印の向きへ回る）
    if (iconRef.current) {
      // 垂直な面に対して「正面」から見て時計回りに回転させる
      iconRef.current.rotation.z -= delta * 4.0 * speedMultiplier;
    }
  });

  const handleEnter = useCallback(
    ({ other }: { other: { rigidBodyObject?: { name?: string } } }) => {
      if (cooldown > 0) return;
      if (other.rigidBodyObject?.name !== 'player') return;

      triggerItemReset();
      setCooldown(COOLDOWN_TIME);
    },
    [cooldown, triggerItemReset]
  );

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider
        args={[SPOT_RADIUS, 0.5, SPOT_RADIUS]}
        sensor
        onIntersectionEnter={handleEnter}
      />

      {/* 地面のベース */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.9} />
      </mesh>

      {/* 左右に回る「看板」グループ */}
      <group ref={billboardRef}>
        {/* 矢印の向きに自転する「アイコン」グループ */}
        <group ref={iconRef}>
          {/* 円弧 */}
          <mesh>
            <torusGeometry args={[0.7, 0.1, 16, 100, Math.PI * 1.5]} />
            <meshStandardMaterial
              color={statusColor}
              emissive={statusColor}
              emissiveIntensity={isActive ? 4 : 1}
              transparent
              opacity={isActive ? 1 : 0.5}
            />
          </mesh>

          {/* 矢印の先端 */}
          <mesh position={[0.7, 0, 0]} rotation-z={-Math.PI / 4}>
            <coneGeometry args={[0.2, 0.4, 4]} />
            <meshStandardMaterial
              color={statusColor}
              emissive={statusColor}
              emissiveIntensity={isActive ? 4 : 1}
            />
          </mesh>
        </group>

        {/* アイコンの真ん中のコア（自転しないパーツ） */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={2} />
        </mesh>
      </group>

      <pointLight
        position={[0, 1.3, 0]}
        intensity={isActive ? 10 : 2}
        distance={5}
        color={statusColor}
      />
    </RigidBody>
  );
}
