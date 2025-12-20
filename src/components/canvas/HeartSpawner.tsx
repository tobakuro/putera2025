import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import useGameStore from '../../stores/useGameStore';

const HEART_MODEL_PATH = '/models/3D/glb/ha-to/kaihuku_ha-to_move.glb';

// stage-specific spawn points (can be adjusted per stage)
const HEART_SPAWN_BY_STAGE: Record<string, [number, number, number][]> = {
  stage0: [
    [2, 1, 6],
    [-12, 1, 14],
    [8, 1, -14],
    [-20, 1, 2],
  ],
  stage1: [
    [18, 1, 24],
    [-6, 1, 28],
    [20, 1, -12],
    [-22, 1, -16],
  ],
};
const DEFAULT_HEART_COUNT = 2;
const HEAL_AMOUNT = 25;

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
      id: `heart-${index}-${position.join(',')}`,
      position,
      collected: false,
    }));
}

// Utilities for stage1 random generation (same rules as keys)
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
    if (isInsideExclude(x, z, exclude)) continue;
    const y = randBetween(bounds.yMin, bounds.yMax);
    const near = out.some((p) => Math.hypot(p[0] - x, p[2] - z) < 1.0);
    if (near) continue;
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
    const other = useGameStore.getState().lastKeySpawns || [];
    const otherPts: [number, number, number][] = other.map((p) => [p.x, p.y, p.z]);
    return generateStage1Points(num, STAGE1_BOUNDS, STAGE1_EXCLUDE, otherPts, 1.8);
  }
  const pts = HEART_SPAWN_BY_STAGE[id] ?? HEART_SPAWN_BY_STAGE['stage0'];
  return shuffle(pts).slice(0, Math.min(num, pts.length));
}

type HeartSpawn = ReturnType<typeof createSpawnSet>[number];

type HeartSpawnerProps = {
  count?: number;
};

export default function HeartSpawner({ count = DEFAULT_HEART_COUNT }: HeartSpawnerProps) {
  const heal = useGameStore((s) => s.heal);
  const stageId = useGameStore((s) => s.stageId);
  const gameState = useGameStore((s) => s.gameState);
  const itemResetTrigger = useGameStore((s) => s.itemResetTrigger);
  const spawnPoints = useMemo(() => getSpawnPointsForStage(stageId, count), [stageId, count]);
  const [hearts, setHearts] = useState<HeartSpawn[]>(() => createSpawnSet(count, spawnPoints));
  const setLastHeartSpawns = useGameStore((s) => s.setLastHeartSpawns);

  useEffect(() => {
    setLastHeartSpawns(spawnPoints.map((p) => ({ x: p[0], y: p[1], z: p[2] })));
  }, [spawnPoints, setLastHeartSpawns]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = window.setTimeout(() => {
      const pts = getSpawnPointsForStage(stageId, count);
      setHearts(createSpawnSet(count, pts));
      useGameStore.getState().setLastHeartSpawns(pts.map((p) => ({ x: p[0], y: p[1], z: p[2] })));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [count, gameState, itemResetTrigger, stageId]);
  const handlePickup = useCallback(
    (id: string) => {
      setHearts((prev) => prev.map((h) => (h.id === id ? { ...h, collected: true } : h)));
      heal(HEAL_AMOUNT);
    },
    [heal]
  );

  return (
    <group>
      {hearts.map((heart) => (
        <HeartInstance key={heart.id} data={heart} onCollect={handlePickup} />
      ))}
    </group>
  );
}

type HeartInstanceProps = {
  data: HeartSpawn;
  onCollect: (id: string) => void;
};

function HeartInstance({ data, onCollect }: HeartInstanceProps) {
  const { id, position, collected } = data;
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    // ゲームが再生中でなければアニメーション停止
    if (useGameStore.getState().gameState !== 'playing') return;
    if (!groupRef.current || collected) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.7;
    groupRef.current.position.y = 0.35 + Math.sin(t * 2.4) * 0.12;
  });

  const handleEnter = useCallback(
    ({ other }: { other: { rigidBodyObject?: { name?: string } } }) => {
      if (collected) return;
      if (other.rigidBodyObject?.name !== 'player') return;
      onCollect(id);
    },
    [collected, id, onCollect]
  );

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider args={[0.6, 0.9, 0.6]} sensor onIntersectionEnter={handleEnter} />
      {!collected && (
        <group ref={groupRef} scale={0.4} position={[0, 0, 0]}>
          <HeartVisual />
        </group>
      )}
    </RigidBody>
  );
}

function HeartVisual() {
  const { scene } = useGLTF(HEART_MODEL_PATH);
  const cloned = useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} />;
}

useGLTF.preload(HEART_MODEL_PATH);
