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

type HeartSpawn = ReturnType<typeof createSpawnSet>[number];

type HeartSpawnerProps = {
  count?: number;
};

export default function HeartSpawner({ count = DEFAULT_HEART_COUNT }: HeartSpawnerProps) {
  const heal = useGameStore((s) => s.heal);
  const stageId = useGameStore((s) => s.stageId);
  const gameState = useGameStore((s) => s.gameState);
  const itemResetTrigger = useGameStore((s) => s.itemResetTrigger);
  const spawnPoints = HEART_SPAWN_BY_STAGE[stageId] ?? HEART_SPAWN_BY_STAGE['stage0'];
  const [hearts, setHearts] = useState<HeartSpawn[]>(() => createSpawnSet(count, spawnPoints));

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = window.setTimeout(() => {
      const pts = HEART_SPAWN_BY_STAGE[stageId] ?? HEART_SPAWN_BY_STAGE['stage0'];
      setHearts(createSpawnSet(count, pts));
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
