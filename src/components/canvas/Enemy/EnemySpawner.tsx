import { useEffect, useRef } from 'react';
import useGameStore from '../../../stores/useGameStore';
import {
  ENEMY_SPAWN_INTERVAL,
  MAX_ENEMIES,
  ENEMY_STATS,
  type EnemyType,
} from '../../../constants/enemies';
import { ENEMY_SPAWN_POINTS } from '../../../constants/stages';
import Enemy from './Enemy';
import * as THREE from 'three';

// レベルに応じた出現可能な敵タイプを返す
const getAllowedEnemyTypesForLevel = (level: number): EnemyType[] => {
  switch (level) {
    case 1:
      return ['basic'];
    case 2:
      return ['basic', 'fast'];
    case 3:
      return ['basic', 'fast', 'tank'];
    case 4:
    default:
      return ['basic', 'fast', 'tank', 'sniper'];
  }
};

// レベルに応じてランダムに敵タイプを選択
const getRandomEnemyType = (level: number): EnemyType => {
  const enemyTypes = getAllowedEnemyTypesForLevel(level);
  return enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
};

interface EnemySpawnerProps {
  playerPosition: THREE.Vector3;
}

export default function EnemySpawner({ playerPosition }: EnemySpawnerProps) {
  const enemies = useGameStore((s) => s.enemies);
  const addEnemy = useGameStore((s) => s.addEnemy);
  const clearEnemies = useGameStore((s) => s.clearEnemies);
  const gameState = useGameStore((s) => s.gameState);
  const stageId = useGameStore((s) => s.stageId);
  const level = useGameStore((s) => s.level);

  const spawnTimerRef = useRef<number>(0);
  const gameStateRef = useRef(gameState);
  const hasInitialSpawnRef = useRef(false);

  // ゲームステートの変更を追跡
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // ゲームがリセットされたら敵をクリアし、初期スポーンフラグをリセット
  useEffect(() => {
    if (gameState === 'menu' || gameState === 'gameover') {
      clearEnemies();
      spawnTimerRef.current = 0;
      hasInitialSpawnRef.current = false;
    }
  }, [gameState, clearEnemies]);

  // ゲーム開始時に初期敵をスポーン
  useEffect(() => {
    if (gameState === 'playing' && !hasInitialSpawnRef.current) {
      hasInitialSpawnRef.current = true;

      // 初期敵を2-3体スポーン
      const initialEnemyCount = 2;
      const spawnPoints = ENEMY_SPAWN_POINTS[stageId] || ENEMY_SPAWN_POINTS.stage0;

      for (let i = 0; i < initialEnemyCount; i++) {
        const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
        const enemyType: EnemyType = getRandomEnemyType(level);
        const id = `enemy-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 11)}`;

        addEnemy({
          id,
          type: enemyType,
          health: ENEMY_STATS[enemyType].maxHealth,
          position: spawnPoint,
        });
      }
    }
  }, [gameState, addEnemy, stageId, level]);

  // 敵のスポーン処理
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      if (gameStateRef.current !== 'playing') return;
      if (enemies.length >= MAX_ENEMIES) return;

      // スポーン位置をランダムに選択
      const spawnPoints = ENEMY_SPAWN_POINTS[stageId] || ENEMY_SPAWN_POINTS.stage0;
      const spawnPoint = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];

      // 敵のタイプをランダムに選択
      const enemyType: EnemyType = getRandomEnemyType(level);

      // ユニークなIDを生成
      const id = `enemy-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // 敵を追加
      addEnemy({
        id,
        type: enemyType,
        health: ENEMY_STATS[enemyType].maxHealth,
        position: spawnPoint,
      });
    }, ENEMY_SPAWN_INTERVAL * 1000);

    return () => clearInterval(interval);
  }, [gameState, enemies.length, addEnemy, stageId, level]);

  // 敵をレンダリング
  return (
    <>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} playerPosition={playerPosition} />
      ))}
    </>
  );
}
