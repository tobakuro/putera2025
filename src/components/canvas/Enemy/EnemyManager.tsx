import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import EnemySpawner from './EnemySpawner';
import useGameStore from '../../../stores/useGameStore';

/**
 * 敵システムの管理コンポーネント
 * プレイヤーの位置を追跡してEnemySpawnerに渡す
 */
export default function EnemyManager() {
  const { scene } = useThree();
  const gameState = useGameStore((s) => s.gameState);
  const [playerPosition] = useState(() => new THREE.Vector3(0, 0, 0));
  const positionRef = useRef(playerPosition);

  useFrame(() => {
    // ゲームが再生中でなければ更新を行わない
    if (gameState !== 'playing') return;
    // シーン内のプレイヤーRigidBodyを探す
    // Playerコンポーネントで設定されたnameを使用
    scene.traverse((obj) => {
      if (obj.userData.isPlayer) {
        positionRef.current.copy(obj.position);
      }
    });
  });

  return <EnemySpawner playerPosition={playerPosition} />;
}
