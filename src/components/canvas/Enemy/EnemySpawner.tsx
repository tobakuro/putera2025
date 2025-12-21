import { useCallback, useEffect, useRef } from 'react';
import useGameStore, { type StageId } from '../../../stores/useGameStore';
import {
  ENEMY_SPAWN_INTERVAL,
  MAX_ENEMIES,
  ENEMY_STATS,
  type EnemyType,
} from '../../../constants/enemies';
import { ENEMY_SPAWN_POINTS } from '../../../constants/stages';
import Enemy from './Enemy';
import * as THREE from 'three';

const FIXED_STAGE_SPAWN_POINTS: Partial<Record<StageId, [number, number, number][]>> = {
  stage0: [
    [11, 0.3, 6],
    [-9, 0.3, 14],
    [-3, 0.3, -16],
  ],
  stage1: [
    [15, 0.3, 15],
    [-15, 0.3, 15],
    [15, 0.3, -15],
  ],
  stage2: [
    [0, 0.3, 0],
    [20, 0.3, 20],
    [-20, 0.3, -20],
  ],
};

const FIXED_STAGE_IDS: StageId[] = ['stage0', 'stage1', 'stage2'];
const PLAYER_SPAWN_AVOID_DISTANCE = 10;
const PLAYER_SPAWN_AVOID_DISTANCE_SQ = PLAYER_SPAWN_AVOID_DISTANCE * PLAYER_SPAWN_AVOID_DISTANCE;

const getStageSpawnPoints = (stageId: StageId) =>
  FIXED_STAGE_SPAWN_POINTS[stageId] ?? ENEMY_SPAWN_POINTS[stageId] ?? ENEMY_SPAWN_POINTS.stage0;

const getSafeSpawnPoints = (stageId: StageId, playerPosition: THREE.Vector3) => {
  const points = getStageSpawnPoints(stageId);
  const farPoints = points.filter(([x, , z]) => {
    const dx = x - playerPosition.x;
    const dz = z - playerPosition.z;
    return dx * dx + dz * dz >= PLAYER_SPAWN_AVOID_DISTANCE_SQ;
  });
  return farPoints.length > 0 ? farPoints : points;
};

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

  const gameStateRef = useRef(gameState);
  const hasInitialSpawnRef = useRef(false);

  const spawnEnemy = useCallback(
    (spawnPoint: [number, number, number], label = 'dynamic') => {
      const enemyType: EnemyType = getRandomEnemyType(level);
      const id = `enemy-${Date.now()}-${label}-${Math.random().toString(36).substring(2, 11)}`;

      addEnemy({
        id,
        type: enemyType,
        health: ENEMY_STATS[enemyType].maxHealth,
        position: spawnPoint,
      });
    },
    [addEnemy, level]
  );

  // ゲームステートの変更を追跡
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // ゲームがリセットされたら敵をクリアし、初期スポーンフラグをリセット
  useEffect(() => {
    if (gameState === 'menu' || gameState === 'gameover') {
      clearEnemies();
      hasInitialSpawnRef.current = false;
    }
  }, [gameState, clearEnemies]);

  // ゲーム開始時に初期敵をスポーン
  useEffect(() => {
    if (gameState !== 'playing' || hasInitialSpawnRef.current) return;
    hasInitialSpawnRef.current = true;

    const isFixedStage = FIXED_STAGE_IDS.includes(stageId);
    const stagePoints = getStageSpawnPoints(stageId);
    if (!stagePoints.length) return;

    let currentCount = enemies.length;

    if (isFixedStage) {
      // For fixed stages (stage0, stage1, stage2/Maze), spawn one enemy per defined coordinate (max 3)
      stagePoints.slice(0, 3).forEach((spawnPoint, index) => {
        if (currentCount >= MAX_ENEMIES) return;
        spawnEnemy(spawnPoint, `init-fixed-${index}`);
        currentCount += 1;
      });
      return;
    }

    const safePoints = getSafeSpawnPoints(stageId, playerPosition);
    const desiredCount = Math.min(2, safePoints.length);
    if (desiredCount === 0) return;

    const available = [...safePoints];
    for (let i = 0; i < desiredCount; i += 1) {
      if (!available.length || currentCount >= MAX_ENEMIES) break;
      const index = Math.floor(Math.random() * available.length);
      const spawnPoint = available.splice(index, 1)[0];
      spawnEnemy(spawnPoint, `init-${i}`);
      currentCount += 1;
    }
  }, [gameState, stageId, playerPosition, spawnEnemy, enemies.length]);

  // 敵のスポーン処理
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      if (gameStateRef.current !== 'playing') return;
      if (useGameStore.getState().enemies.length >= MAX_ENEMIES) return;

      const safePoints = getSafeSpawnPoints(stageId, playerPosition);
      if (!safePoints.length) return;
      const spawnPoint = safePoints[Math.floor(Math.random() * safePoints.length)];
      spawnEnemy(spawnPoint);
    }, ENEMY_SPAWN_INTERVAL * 1000);

    return () => clearInterval(interval);
  }, [gameState, stageId, spawnEnemy, playerPosition]);

  // 敵をレンダリング
  return (
    <>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} playerPosition={playerPosition} />
      ))}
    </>
  );
}
