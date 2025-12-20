import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnemySpawner from './EnemySpawner';
import useGameStore from '../../../stores/useGameStore';
import { perfEnd, perfStart } from '../../../utils/perf';

/**
 * 敵システムの管理コンポーネント
 * プレイヤーの位置を追跡してEnemySpawnerに渡す
 */
export default function EnemyManager() {
  const gameState = useGameStore((s) => s.gameState);
  const playerPositionState = useGameStore((s) => s.playerPosition);

  // EnemySpawner に渡す Vector3 は参照を固定し、値だけを更新する
  const playerPosition = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(() => {
    // ゲームが再生中でなければ更新を行わない
    if (gameState !== 'playing') return;
    const t = perfStart('EnemyManager.playerPos');
    // Player 側で毎フレーム更新しているストア座標を参照
    playerPosition.set(playerPositionState.x, playerPositionState.y, playerPositionState.z);
    perfEnd(t);
  });

  return <EnemySpawner playerPosition={playerPosition} />;
}
