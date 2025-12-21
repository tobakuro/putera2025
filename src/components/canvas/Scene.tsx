'use client';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Physics } from '@react-three/rapier';
import Player from './Player';
import Level from './Level';
import KeySpawner from './KeySpawner';
import HeartSpawner from './HeartSpawner';
import AmmoSpawner from './Items/AmmoSpawner';
import EnemyManager from './Enemy/EnemyManager';
import ResetSpot from './ResetSpot';
import useGameStore from '../../stores/useGameStore';
import { RESET_SPOTS } from '../../constants/stages';
import {
  AMBIENT_INTENSITY,
  DIRECTIONAL_LIGHT,
  HEMISPHERE_LIGHT,
  CONTACT_SHADOWS,
} from '../../constants/lights';
import { ContactShadows } from '@react-three/drei';

export default function Scene() {
  return (
    <Canvas
      shadows // 影を有効化
      camera={{
        position: [0, 5, 10],
        fov: 75,
      }}
      // gl を渡してシャドウタイプや物理ライティングを有効化
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={(state) => {
        // use PCF soft shadows for smoother contact shadows
        state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
        // 型を拡張して安全に physicallyCorrectLights を設定する（any を避ける）
        const gl = state.gl as THREE.WebGLRenderer & { physicallyCorrectLights?: boolean };
        gl.physicallyCorrectLights = true;
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* 環境光（暗い部分を少し明るくするために強めに設定） */}
      {/* 環境光: 影の最大暗さを抑えるため、shadowDarknessCap に応じて少し明るくする */}
      <ambientLight
        intensity={AMBIENT_INTENSITY + (1 - DIRECTIONAL_LIGHT.shadowDarknessCap) * 0.6}
      />

      {/* 補助の半球光で全体のコントラストを和らげ、小さな凹凸の過剰な強調を抑える */}
      {/* HemisphereLight は constructor args で指定（型安全） */}
      <hemisphereLight
        args={[HEMISPHERE_LIGHT.skyColor, HEMISPHERE_LIGHT.groundColor, HEMISPHERE_LIGHT.intensity]}
      />

      {/*
        方向光（太陽光の代替）:
        強度を上げ、シャドウカメラの範囲を広げてマップ全体を照らすようにします。
        shadowMapSize を大きくすると影の解像度は上がりますが、GPU 負荷が増えます。
      */}
      <directionalLight
        position={DIRECTIONAL_LIGHT.position}
        // 影の暗さを抑えるために最大明るさを cap で縮小して使う
        intensity={DIRECTIONAL_LIGHT.intensity * DIRECTIONAL_LIGHT.shadowDarknessCap}
        castShadow // ライトも影を落とすように
        shadow-mapSize-width={DIRECTIONAL_LIGHT.shadowMapSize}
        shadow-mapSize-height={DIRECTIONAL_LIGHT.shadowMapSize}
        shadow-camera-near={DIRECTIONAL_LIGHT.shadowCamera.near}
        shadow-camera-far={DIRECTIONAL_LIGHT.shadowCamera.far}
        shadow-camera-left={DIRECTIONAL_LIGHT.shadowCamera.left}
        shadow-camera-right={DIRECTIONAL_LIGHT.shadowCamera.right}
        shadow-camera-top={DIRECTIONAL_LIGHT.shadowCamera.top}
        shadow-camera-bottom={DIRECTIONAL_LIGHT.shadowCamera.bottom}
        shadow-bias={DIRECTIONAL_LIGHT.shadowBias}
        shadow-radius={DIRECTIONAL_LIGHT.shadowRadius}
      />

      <Physics gravity={[0, -9.81, 0]}>
        <Player />

        <Level />

        <KeySpawner />
        <HeartSpawner />
        <AmmoSpawner />

        {/* 敵システム */}
        <EnemyManager />

        {/* Stage-specific reset spots: don't render for stages without a RESET_SPOTS entry (e.g., stage2) */}
        {(() => {
          const stageId = useGameStore.getState().stageId;
          const pos = RESET_SPOTS[stageId];
          return pos ? <ResetSpot position={pos} /> : null;
        })()}
        {/* ContactShadows を追加して接地部の細かい影を表現（凹凸の密度感を改善） */}
        <ContactShadows
          position={CONTACT_SHADOWS.position}
          opacity={CONTACT_SHADOWS.opacity}
          width={CONTACT_SHADOWS.width}
          height={CONTACT_SHADOWS.height}
          blur={CONTACT_SHADOWS.blur}
          far={CONTACT_SHADOWS.far}
        />
      </Physics>
    </Canvas>
  );
}
