import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import AmmoItem from './AmmoItem';
import {
  AMMO_SPAWN_POSITIONS,
  AMMO_SPAWN_INTERVAL,
  AMMO_SPAWN_PER_KILLS,
} from '../../../constants/items';
import useGameStore from '../../../stores/useGameStore';

type AmmoData = {
  id: string;
  position: THREE.Vector3;
};

let ammoIdCounter = 0;

export default function AmmoSpawner() {
  const [ammos, setAmmos] = useState<AmmoData[]>([]);
  const lastTimeSpawnRef = useRef(0);
  const lastKillCountRef = useRef(0);
  const gameState = useGameStore((s) => s.gameState);
  const enemyKillCount = useGameStore((s) => s.enemyKillCount || 0);

  // ゲーム開始時に初期化
  useEffect(() => {
    if (gameState === 'playing') {
      lastTimeSpawnRef.current = 0;
      lastKillCountRef.current = 0;
      setAmmos([]);
    }
  }, [gameState]);

  // 時間経過でのスポーン
  useFrame((state) => {
    if (gameState !== 'playing') return;

    const currentTime = state.clock.getElapsedTime();

    // 時間経過でのスポーン（15秒ごと）
    if (currentTime - lastTimeSpawnRef.current >= AMMO_SPAWN_INTERVAL) {
      spawnAmmo();
      lastTimeSpawnRef.current = currentTime;
    }
  });

  // 敵撃破数でのスポーン
  useEffect(() => {
    if (gameState !== 'playing') return;

    const killsSinceLastSpawn = enemyKillCount - lastKillCountRef.current;

    if (killsSinceLastSpawn >= AMMO_SPAWN_PER_KILLS) {
      spawnAmmo();
      lastKillCountRef.current = enemyKillCount;
    }
  }, [enemyKillCount, gameState]);

  // Ammoをスポーンする関数
  const spawnAmmo = () => {
    // ランダムな座標を選択
    const randomIndex = Math.floor(Math.random() * AMMO_SPAWN_POSITIONS.length);
    const position = AMMO_SPAWN_POSITIONS[randomIndex];

    const newAmmo: AmmoData = {
      id: `ammo-${ammoIdCounter++}`,
      position: position.clone(),
    };

    setAmmos((prev) => [...prev, newAmmo]);
  };

  // Ammoを回収したときの処理
  const handleCollect = (id: string) => {
    setAmmos((prev) => prev.filter((ammo) => ammo.id !== id));
  };

  return (
    <>
      {ammos.map((ammo) => (
        <AmmoItem key={ammo.id} id={ammo.id} position={ammo.position} onCollect={handleCollect} />
      ))}
    </>
  );
}
