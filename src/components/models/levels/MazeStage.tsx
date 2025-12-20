import { RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';

const MAZE_SIZE = 20;
const CELL_SIZE = 4;
const WALL_HEIGHT = 8;
const WALL_THICKNESS = 0.5;

type Cell = {
  x: number;
  z: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
};

// 深さ優先探索で迷路を生成
function generateMaze(size: number): Cell[][] {
  const maze: Cell[][] = [];

  // 初期化
  for (let x = 0; x < size; x++) {
    maze[x] = [];
    for (let z = 0; z < size; z++) {
      maze[x][z] = {
        x,
        z,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
      };
    }
  }

  const stack: Cell[] = [];
  let current = maze[0][0];
  current.visited = true;
  stack.push(current);

  while (stack.length > 0) {
    const neighbors: { cell: Cell; direction: string }[] = [];

    // 未訪問の隣接セルを探す
    const { x, z } = current;
    if (x > 0 && !maze[x - 1][z].visited) {
      neighbors.push({ cell: maze[x - 1][z], direction: 'left' });
    }
    if (x < size - 1 && !maze[x + 1][z].visited) {
      neighbors.push({ cell: maze[x + 1][z], direction: 'right' });
    }
    if (z > 0 && !maze[x][z - 1].visited) {
      neighbors.push({ cell: maze[x][z - 1], direction: 'top' });
    }
    if (z < size - 1 && !maze[x][z + 1].visited) {
      neighbors.push({ cell: maze[x][z + 1], direction: 'bottom' });
    }

    if (neighbors.length > 0) {
      // ランダムに隣接セルを選択
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];

      // 壁を削除
      if (next.direction === 'left') {
        current.walls.left = false;
        next.cell.walls.right = false;
      } else if (next.direction === 'right') {
        current.walls.right = false;
        next.cell.walls.left = false;
      } else if (next.direction === 'top') {
        current.walls.top = false;
        next.cell.walls.bottom = false;
      } else if (next.direction === 'bottom') {
        current.walls.bottom = false;
        next.cell.walls.top = false;
      }

      next.cell.visited = true;
      stack.push(next.cell);
      current = next.cell;
    } else {
      current = stack.pop()!;
    }
  }

  // 出口を作成（右下の角）
  maze[size - 1][size - 1].walls.right = false;
  maze[size - 1][size - 1].walls.bottom = false;

  return maze;
}

export default function MazeStage() {
  const maze = useMemo(() => generateMaze(MAZE_SIZE), []);

  const walls = useMemo(() => {
    const wallList: { position: [number, number, number]; rotation: number; length: number }[] = [];

    for (let x = 0; x < MAZE_SIZE; x++) {
      for (let z = 0; z < MAZE_SIZE; z++) {
        const cell = maze[x][z];
        const worldX = (x - MAZE_SIZE / 2) * CELL_SIZE;
        const worldZ = (z - MAZE_SIZE / 2) * CELL_SIZE;

        // 上の壁
        if (cell.walls.top) {
          wallList.push({
            position: [worldX, WALL_HEIGHT / 2, worldZ - CELL_SIZE / 2],
            rotation: 0,
            length: CELL_SIZE,
          });
        }
        // 右の壁
        if (cell.walls.right) {
          wallList.push({
            position: [worldX + CELL_SIZE / 2, WALL_HEIGHT / 2, worldZ],
            rotation: Math.PI / 2,
            length: CELL_SIZE,
          });
        }
        // 下の壁
        if (cell.walls.bottom) {
          wallList.push({
            position: [worldX, WALL_HEIGHT / 2, worldZ + CELL_SIZE / 2],
            rotation: 0,
            length: CELL_SIZE,
          });
        }
        // 左の壁
        if (cell.walls.left) {
          wallList.push({
            position: [worldX - CELL_SIZE / 2, WALL_HEIGHT / 2, worldZ],
            rotation: Math.PI / 2,
            length: CELL_SIZE,
          });
        }
      }
    }

    return wallList;
  }, [maze]);

  return (
    <group>
      {/* 床 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[MAZE_SIZE * CELL_SIZE, 0.5, MAZE_SIZE * CELL_SIZE]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      </RigidBody>

      {/* 壁 */}
      {walls.map((wall, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid">
          <mesh castShadow receiveShadow position={wall.position} rotation-y={wall.rotation}>
            <boxGeometry args={[wall.length, WALL_HEIGHT, WALL_THICKNESS]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
        </RigidBody>
      ))}

      {/* 外周の壁 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          position={[0, WALL_HEIGHT / 2, -(MAZE_SIZE * CELL_SIZE) / 2 - WALL_THICKNESS / 2]}
        >
          <boxGeometry
            args={[MAZE_SIZE * CELL_SIZE + WALL_THICKNESS * 2, WALL_HEIGHT, WALL_THICKNESS]}
          />
          <meshStandardMaterial color="#444444" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          position={[0, WALL_HEIGHT / 2, (MAZE_SIZE * CELL_SIZE) / 2 + WALL_THICKNESS / 2]}
        >
          <boxGeometry
            args={[MAZE_SIZE * CELL_SIZE + WALL_THICKNESS * 2, WALL_HEIGHT, WALL_THICKNESS]}
          />
          <meshStandardMaterial color="#444444" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          position={[-(MAZE_SIZE * CELL_SIZE) / 2 - WALL_THICKNESS / 2, WALL_HEIGHT / 2, 0]}
        >
          <boxGeometry
            args={[WALL_THICKNESS, WALL_HEIGHT, MAZE_SIZE * CELL_SIZE + WALL_THICKNESS * 2]}
          />
          <meshStandardMaterial color="#444444" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          position={[(MAZE_SIZE * CELL_SIZE) / 2 + WALL_THICKNESS / 2, WALL_HEIGHT / 2, 0]}
        >
          <boxGeometry
            args={[WALL_THICKNESS, WALL_HEIGHT, MAZE_SIZE * CELL_SIZE + WALL_THICKNESS * 2]}
          />
          <meshStandardMaterial color="#444444" />
        </mesh>
      </RigidBody>

      {/* 出口マーカー（右下、緑色の光） */}
      <mesh position={[(MAZE_SIZE / 2 - 0.5) * CELL_SIZE, 0.5, (MAZE_SIZE / 2 - 0.5) * CELL_SIZE]}>
        <boxGeometry args={[CELL_SIZE * 0.8, 0.2, CELL_SIZE * 0.8]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}
