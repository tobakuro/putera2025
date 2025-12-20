import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import useGameStore from '../../stores/useGameStore';
import { MAX_KEYS } from '../../constants/keys';

const KEY_MODEL_PATH = '/models/3D/glb/key/key_move.glb';
// stage-specific key spawn points
const KEY_SPAWN_BY_STAGE: Record<string, [number, number, number][]> = {
  stage0: [
    [4, 1, -6],
    [-8, 1, 12],
    [10, 1, 20],
  ],
  stage1: [
    [-16, 1, 4],
    [6, 1, 32],
    //[2.7,-0.5,-2.5],//決定
    //[-5,-0.5,5],//決定
    //[14, 1, -18],
    [22, 1, 8],
  ],
};
// default count can be overridden via prop; MAX_KEYS defines game-wide maximum

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createSpawnSet(count: number, spawnPoints: [number, number, number][]) {
  const clamped = Math.max(0, Math.min(count, spawnPoints.length));
  return shuffle(spawnPoints)
    .slice(0, clamped)
    .map((position, index) => ({
      id: `key-${index}-${position.join(',')}`,
      position,
      collected: false,
    }));
}

// Utilities for generating random points in a rectangle while excluding a sub-rectangle
function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function round1(v: number) {
  return Math.round(v * 10) / 10;
}

type Rect = { xMin: number; xMax: number; zMin: number; zMax: number };

function isInsideExclude(x: number, z: number, ex: Rect) {
  return x >= ex.xMin && x <= ex.xMax && z >= ex.zMin && z <= ex.zMax;
}

function generateStage1Points(
  count: number,
  bounds: { xMin: number; xMax: number; zMin: number; zMax: number; yMin: number; yMax: number },
  exclude: Rect,
  otherPoints: [number, number, number][] = [],
  minDistance = 1.5,
  maxAttempts = 1000
): [number, number, number][] {
  const out: [number, number, number][] = [];
  let attempts = 0;
  while (out.length < count && attempts < maxAttempts) {
    attempts += 1;
    const x = randBetween(bounds.xMin, bounds.xMax);
    const z = randBetween(bounds.zMin, bounds.zMax);
    // Apply exclusion on rounded coordinates (user requested)
    const rx = round1(x);
    const rz = round1(z);
    if (isInsideExclude(rx, rz, exclude)) continue;
    const y = randBetween(bounds.yMin, bounds.yMax);
    // avoid near-duplicates among generated
    const near = out.some((p) => Math.hypot(p[0] - x, p[2] - z) < 1.0);
    if (near) continue;
    // avoid proximity to otherPoints (e.g., hearts)
    const nearOther = otherPoints.some((p) => Math.hypot(p[0] - x, p[2] - z) < minDistance);
    if (nearOther) continue;
    out.push([round1(x), round1(y), round1(z)]);
  }
  return out;
}

// Top-level stage1 bounds/exclude so getSpawnPointsForStage can be stable
const STAGE1_BOUNDS = { xMin: -28, xMax: 28, zMin: -27, zMax: 27, yMin: -0.5, yMax: 1 };
const STAGE1_EXCLUDE: Rect = { xMin: -12, xMax: -11, zMin: 23, zMax: 27 };

function getSpawnPointsForStage(id: string, num: number) {
  if (id === 'stage1') {
    const other = useGameStore.getState().lastHeartSpawns || [];
    const otherPts: [number, number, number][] = other.map((p) => [p.x, p.y, p.z]);
    return generateStage1Points(num, STAGE1_BOUNDS, STAGE1_EXCLUDE, otherPts, 1.8);
  }
  const pts = KEY_SPAWN_BY_STAGE[id] ?? KEY_SPAWN_BY_STAGE['stage0'];
  return shuffle(pts).slice(0, Math.min(num, pts.length));
}

type KeySpawn = ReturnType<typeof createSpawnSet>[number];

type KeySpawnerProps = {
  count?: number;
};

export default function KeySpawner({ count = MAX_KEYS }: KeySpawnerProps) {
  const collectKey = useGameStore((s) => s.collectKey);
  const setTotalKeys = useGameStore((s) => s.setTotalKeys);
  const resetKeys = useGameStore((s) => s.resetKeys);
  const keysCollected = useGameStore((s) => s.keysCollected);
  const gameState = useGameStore((s) => s.gameState);
  const itemResetTrigger = useGameStore((s) => s.itemResetTrigger);
  const prevGameStateRef = useRef(gameState);
  const stageId = useGameStore((s) => s.stageId);

  // Maze (stage2) should only spawn a single key
  const effectiveCount = stageId === 'stage2' ? 1 : count;

  // Desired number to spawn considering player's held keys
  const desiredCount = Math.max(0, Math.min(effectiveCount, MAX_KEYS - keysCollected));

  const spawnPoints = useMemo(
    () => getSpawnPointsForStage(stageId, desiredCount),
    [stageId, desiredCount]
  );
  const [keys, setKeys] = useState<KeySpawn[]>(() => createSpawnSet(desiredCount, spawnPoints));
  const setLastKeySpawns = useGameStore((s) => s.setLastKeySpawns);

  // publish initial key spawn positions to store for other spawners
  useEffect(() => {
    setLastKeySpawns(spawnPoints.map((p) => ({ x: p[0], y: p[1], z: p[2] })));
  }, [spawnPoints, setLastKeySpawns]);

  useEffect(() => {
    if (gameState !== 'playing') {
      prevGameStateRef.current = gameState;
      return;
    }
    // Only reset keys when entering playing from menu or gameover (new session)
    const prev = prevGameStateRef.current;
    const timer = window.setTimeout(() => {
      const pts = getSpawnPointsForStage(stageId, desiredCount);
      const spawnCount = Math.max(
        0,
        Math.min(effectiveCount, MAX_KEYS - useGameStore.getState().keysCollected, pts.length)
      );
      setKeys(createSpawnSet(spawnCount, pts));
      // publish to store for hearts to avoid
      useGameStore.getState().setLastKeySpawns(pts.map((p) => ({ x: p[0], y: p[1], z: p[2] })));
      if (prev === 'menu' || prev === 'gameover') {
        resetKeys();
      }
    }, 0);
    prevGameStateRef.current = gameState;
    return () => window.clearTimeout(timer);
  }, [count, gameState, resetKeys, itemResetTrigger, stageId, desiredCount, effectiveCount]);

  // Update total keys whenever map/held counts change
  useEffect(() => {
    if (stageId === 'stage2') {
      // Maze requires only one key
      setTotalKeys(effectiveCount);
    } else {
      setTotalKeys(keys.length + keysCollected);
    }
  }, [keys.length, keysCollected, setTotalKeys, stageId, effectiveCount]);

  // On unmount (leaving the spawner), reset totals and held keys
  useEffect(() => {
    return () => {
      setTotalKeys(0);
      resetKeys();
    };
  }, [setTotalKeys, resetKeys]);

  const handlePickup = useCallback(
    (id: string) => {
      setKeys((prev) => prev.map((key) => (key.id === id ? { ...key, collected: true } : key)));
      collectKey();
    },
    [collectKey]
  );

  return (
    <group>
      {keys.map((key) => (
        <KeyInstance key={key.id} data={key} onCollect={handlePickup} />
      ))}
    </group>
  );
}

type KeyInstanceProps = {
  data: KeySpawn;
  onCollect: (id: string) => void;
};

function KeyInstance({ data, onCollect }: KeyInstanceProps) {
  const { id, position, collected } = data;
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    // ゲームが再生中でなければアニメーション停止
    if (useGameStore.getState().gameState !== 'playing') return;
    if (!groupRef.current || collected) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.9;
    groupRef.current.position.y = 0.3 + Math.sin(t * 2) * 0.1;
  });

  const handleEnter = useCallback(
    ({ other }: { other?: { rigidBodyObject?: { name?: string } } }) => {
      if (collected) return;
      // First try the rapier-provided object name check
      if (other?.rigidBodyObject?.name === 'player') {
        onCollect(id);
        return;
      }
      // Fallback: compare player position to this key position (robust if rapier event shape differs)
      const playerPos = useGameStore.getState().playerPosition;
      if (playerPos) {
        const dx = playerPos.x - position[0];
        const dz = playerPos.z - position[2];
        const dist = Math.hypot(dx, dz);
        if (dist < 1.5) {
          onCollect(id);
        }
      }
    },
    [collected, id, onCollect, position]
  );

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider args={[0.6, 0.8, 0.6]} sensor onIntersectionEnter={handleEnter} />
      {!collected && (
        <group ref={groupRef} scale={0.35} position={[0, 0, 0]}>
          <KeyVisual />
        </group>
      )}
    </RigidBody>
  );
}

function KeyVisual() {
  const { scene } = useGLTF(KEY_MODEL_PATH);
  const cloned = useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} />;
}

useGLTF.preload(KEY_MODEL_PATH);
