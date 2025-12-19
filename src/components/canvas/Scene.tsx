'use client';

import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import Player from './Player';
import Level from './Level';

export default function Scene() {
  return (
    <Canvas
      shadows // 影を有効化
      camera={{
        position: [0, 5, 10],
        fov: 75,
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow // ライトも影を落とすように
      />

      <Physics gravity={[0, -9.81, 0]}>
        <Player />

        <Level />

        {/* テスト用の立方体 */}
        <RigidBody colliders="cuboid">
          <mesh position={[0, 5, 0]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ff6b6b" />
          </mesh>
        </RigidBody>
      </Physics>
    </Canvas>
  );
}
