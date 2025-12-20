import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useGameStore from '../../stores/useGameStore'; // パスは環境に合わせて調整してください

export function KeyItem() {
  const meshRef = useRef<THREE.Group>(null);
  const collectKey = useGameStore((state) => state.collectKey);

  // 固定座標
  const POSITION: [number, number, number] = [36.1, 0.6, 36.0];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Y軸を中心に回転させるアニメーション
      meshRef.current.rotation.y = t * 2;
      // 少し上下にふわふわさせる演出
      meshRef.current.position.y = Math.sin(t * 2) * 0.1;
    }
  });

  const handleEnter = ({ other }: { other: { rigidBodyObject?: { name?: string } } }) => {
    if (other.rigidBodyObject?.name === 'player') {
      // Zustandのストアで鍵取得処理を実行
      collectKey();
      console.log('鍵をゲットしました！');
      // 本来はここで鍵を消去するフラグを立てる等の処理が必要ですが、
      // 今回はシンプルにログを表示します。
    }
  };

  return (
    <group position={POSITION}>
      <RigidBody type="fixed" colliders={false}>
        {/* プレイヤーとの接触判定用センサー */}
        <CuboidCollider args={[0.5, 0.5, 0.5]} sensor onIntersectionEnter={handleEnter} />
      </RigidBody>

      <group ref={meshRef}>
        {/* 鍵の見た目（青いクリスタルのようなデザイン） */}
        {/* 上部の輪 */}
        <mesh position={[0, 0.4, 0]}>
          <torusGeometry args={[0.15, 0.05, 16, 100]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
        </mesh>
        {/* 鍵の棒部分 */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
        </mesh>
        {/* 下のギザギザ部分 */}
        <mesh position={[0.1, -0.15, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.1, -0.25, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
        </mesh>

        {/* 鍵をキラキラさせる点光源 */}
        <pointLight intensity={2} distance={3} color="#00ffff" />
      </group>
    </group>
  );
}
