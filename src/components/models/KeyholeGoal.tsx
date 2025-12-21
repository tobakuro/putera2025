import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useGameStore from '../../stores/useGameStore';
import { getScaledGoalPosition } from '../../constants/goals';

export function KeyholeGoal() {
  const groupRef = useRef<THREE.Group>(null);
  const keysCollected = useGameStore((state) => state.keysCollected);
  const totalKeys = useGameStore((state) => state.totalKeys);
  const isUnlocked = keysCollected >= totalKeys && totalKeys > 0;

  // ステージに応じた座標を定数から取得（STAGE_SCALE を考慮）
  const stageId = useGameStore((s) => s.stageId);
  const POSITION: [number, number, number] = getScaledGoalPosition(stageId);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // 指定通りの「回転アニメーション」を追加
      groupRef.current.rotation.y = t * 0.8;
      // 上下にも少し浮かせる
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.2;
    }
  });
  // フレームの経過時間を保持して handleEnter から使えるようにする
  const latestTimeRef = useRef<number>(0);
  useFrame((state) => {
    latestTimeRef.current = state.clock.getElapsedTime();
  });

  const clearGame = useGameStore((s) => s.clearGame);

  const handleEnter = ({ other }: { other: { rigidBodyObject?: { name?: string } } }) => {
    if (other.rigidBodyObject?.name === 'player' && isUnlocked) {
      // 鍵が揃っていれば経過時間を渡してクリア処理を発行
      const elapsed = latestTimeRef.current ?? null;
      if (clearGame) {
        clearGame(elapsed ?? undefined);
      } else if (typeof window !== 'undefined') {
        // フォールバック: 旧実装と同様のページ遷移（互換性保険）
        window.location.href = '/goal';
      }
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
