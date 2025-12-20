import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import useGameStore from '../../stores/useGameStore';
import { MAX_KEYS } from '../../constants/keys';

const KEY_MODEL_PATH = '/models/3D/glb/key/key_move.glb';
const KEY_SPAWN_POINTS: [number, number, number][] = [
  [4, 1, -6],
  [-8, 1, 12],
  [10, 1, 20],
  [-16, 1, 4],
  [6, 1, 32],
  [-18, 1, -10],
  [14, 1, -18],
  [22, 1, 8],
];
// default count can be overridden via prop; MAX_KEYS defines game-wide maximum

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createSpawnSet(count: number) {
  const clamped = Math.max(0, Math.min(count, KEY_SPAWN_POINTS.length));
  return shuffle(KEY_SPAWN_POINTS)
    .slice(0, clamped)
    .map((position, index) => ({
      id: `key-${index}-${position.join(',')}`,
      position,
      collected: false,
    }));
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

  // Ensure we don't spawn more keys than allowed by MAX_KEYS when
  // combined with the player's currently held keys.
  const effectiveSpawnCount = Math.max(
    0,
    Math.min(count, MAX_KEYS - keysCollected, KEY_SPAWN_POINTS.length)
  );

  const [keys, setKeys] = useState<KeySpawn[]>(() => createSpawnSet(effectiveSpawnCount));

  useEffect(() => {
    if (gameState !== 'playing') {
      prevGameStateRef.current = gameState;
      return;
    }
    // Only reset keys when entering playing from menu or gameover (new session)
    const prev = prevGameStateRef.current;
    const timer = window.setTimeout(() => {
      const spawnCount = Math.max(
        0,
        Math.min(count, MAX_KEYS - useGameStore.getState().keysCollected, KEY_SPAWN_POINTS.length)
      );
      setKeys(createSpawnSet(spawnCount));
      if (prev === 'menu' || prev === 'gameover') {
        resetKeys();
      }
    }, 0);
    prevGameStateRef.current = gameState;
    return () => window.clearTimeout(timer);
  }, [count, gameState, resetKeys, itemResetTrigger]);

  useEffect(() => {
    // totalKeys represents the total remaining in the level = on-map + held
    setTotalKeys(keys.length + keysCollected);
    return () => {
      setTotalKeys(0);
      resetKeys();
    };
  }, [keys.length, keysCollected, resetKeys, setTotalKeys]);

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
    if (!groupRef.current || collected) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.9;
    groupRef.current.position.y = 0.3 + Math.sin(t * 2) * 0.1;
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
