import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useGameStore from '../../stores/useGameStore';

export function KeyholeGoal() {
  const groupRef = useRef<THREE.Group>(null);
  const keysCollected = useGameStore((state) => state.keysCollected);
  const totalKeys = useGameStore((state) => state.totalKeys);
  const isUnlocked = keysCollected >= totalKeys && totalKeys > 0;

  // 鍵穴の固定座標
  const POSITION: [number, number, number] = [36.1, 1.5, 36.0];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // 指定通りの「回転アニメーション」を追加
      groupRef.current.rotation.y = t * 0.8;
      // 上下にも少し浮かせる
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.2;
    }
  });

  const handleEnter = ({ other }: { other: { rigidBodyObject?: { name?: string } } }) => {
    if (other.rigidBodyObject?.name === 'player' && isUnlocked) {
      if (typeof window !== 'undefined') window.location.href = '/goal';
    }
  };

  return (
    <group position={POSITION}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.5, 2, 1.5]} sensor onIntersectionEnter={handleEnter} />
      </RigidBody>

      <group ref={groupRef}>
        {/* 外枠の青いリング */}
        <mesh>
          <torusGeometry args={[1.2, 0.08, 16, 100]} />
          <meshStandardMaterial
            color={isUnlocked ? '#00ffff' : '#004466'}
            emissive={isUnlocked ? '#00ffff' : '#002233'}
            emissiveIntensity={isUnlocked ? 10 : 2}
          />
        </mesh>

        {/* 中央の青い円（鍵穴シンボル） */}
        <mesh position={[0, 0.2, 0]}>
          <circleGeometry args={[0.35, 32]} />
          <meshBasicMaterial color={isUnlocked ? '#00ffff' : '#0088ff'} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <planeGeometry args={[0.3, 0.5]} />
          <meshBasicMaterial color={isUnlocked ? '#00ffff' : '#0088ff'} side={THREE.DoubleSide} />
        </mesh>

        {/* 光源 */}
        <pointLight intensity={isUnlocked ? 15 : 2} distance={8} color="#00ffff" />
      </group>
    </group>
  );
}
