'use client';

import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { OrbitControls } from '@react-three/drei';

export default function Scene() {
  return (
    <Canvas
      camera={{
        position: [0, 5, 10],
        fov: 75,
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* 照明 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* 物理世界 */}
      <Physics gravity={[0, -9.81, 0]}>
        {/* 床 */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, -0.5, 0]} receiveShadow>
            <boxGeometry args={[20, 1, 20]} />
            <meshStandardMaterial color="#808080" />
          </mesh>
        </RigidBody>

        {/* テスト用の立方体 */}
        <RigidBody colliders="cuboid">
          <mesh position={[0, 5, 0]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ff6b6b" />
          </mesh>
        </RigidBody>
      </Physics>

      {/* デバッグ用カメラコントロール */}
      <OrbitControls />
    </Canvas>
  );
}
