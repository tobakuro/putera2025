import { RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';
import { KeyholeGoal } from '../KeyholeGoal';

const MAZE_SIZE = 20;
const CELL_SIZE = 4;
const WALL_HEIGHT = 8;
const WALL_THICKNESS = 0.5;

type Cell = {
  x: number;
  z: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
};

export default function MazeStage() {
  const maze = useMemo(() => generateMaze(MAZE_SIZE), []);

  const walls = useMemo(() => {
    const wallList: { position: [number, number, number]; rotation: number; length: number }[] = [];
    for (let x = 0; x < MAZE_SIZE; x++) {
      for (let z = 0; z < MAZE_SIZE; z++) {
        const cell = maze[x][z];
        const worldX = (x - MAZE_SIZE / 2) * CELL_SIZE;
        const worldZ = (z - MAZE_SIZE / 2) * CELL_SIZE;

        if (cell.walls.top)
          wallList.push({
            position: [worldX, WALL_HEIGHT / 2, worldZ - CELL_SIZE / 2],
            rotation: 0,
            length: CELL_SIZE,
          });
        if (cell.walls.right)
          wallList.push({
            position: [worldX + CELL_SIZE / 2, WALL_HEIGHT / 2, worldZ],
            rotation: Math.PI / 2,
            length: CELL_SIZE,
          });
        if (cell.walls.bottom)
          wallList.push({
            position: [worldX, WALL_HEIGHT / 2, worldZ + CELL_SIZE / 2],
            rotation: 0,
            length: CELL_SIZE,
          });
        if (cell.walls.left)
          wallList.push({
            position: [worldX - CELL_SIZE / 2, WALL_HEIGHT / 2, worldZ],
            rotation: Math.PI / 2,
            length: CELL_SIZE,
          });
      }
    }
    return wallList;
  }, [maze]);

  const bounds = useMemo(() => {
    if (walls.length === 0) return { minX: -40, maxX: 40, minZ: -40, maxZ: 40 };
    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;
    for (const w of walls) {
      const [wx, , wz] = w.position;
      const isHorizontal = Math.abs(w.rotation) < 0.0001;
      if (isHorizontal) {
        minX = Math.min(minX, wx - w.length / 2);
        maxX = Math.max(maxX, wx + w.length / 2);
        minZ = Math.min(minZ, wz - 0.25);
        maxZ = Math.max(maxZ, wz + 0.25);
      } else {
        minX = Math.min(minX, wx - 0.25);
        maxX = Math.max(maxX, wx + 0.25);
        minZ = Math.min(minZ, wz - w.length / 2);
        maxZ = Math.max(maxZ, wz + w.length / 2);
      }
    }
    return { minX, maxX, minZ, maxZ };
  }, [walls]);

  return (
    <group>
      {/* 床 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          receiveShadow
          userData={{ type: 'ground' }}
          position={[(bounds.minX + bounds.maxX) / 2, 0, (bounds.minZ + bounds.maxZ) / 2]}
        >
          <boxGeometry
            args={[
              bounds.maxX - bounds.minX + WALL_THICKNESS,
              0.5,
              bounds.maxZ - bounds.minZ + WALL_THICKNESS,
            ]}
          />
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

      {/* 修正ポイント：指定座標に「回転する鍵穴」を配置 */}
      <KeyholeGoal />

      {/* ※もし別途「拾うための鍵」をどこかに置きたい場合は 
        <KeyItem /> を追加してください。 
      */}
    </group>
  );
}

// 迷路生成ロジック（そのまま維持）
function generateMaze(size: number): Cell[][] {
  const maze: Cell[][] = Array.from({ length: size }, (_, x) =>
    Array.from({ length: size }, (_, z) => ({
      x,
      z,
      walls: { top: true, right: true, bottom: true, left: true },
    }))
  );
  const visited = new Set<string>();
  const stack: Cell[] = [];
  const start = maze[0][0];
  stack.push(start);
  visited.add(`${start.x},${start.z}`);
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = [
      { cell: maze[current.x]?.[current.z - 1], dir: 'top' as const, opposite: 'bottom' as const },
      { cell: maze[current.x + 1]?.[current.z], dir: 'right' as const, opposite: 'left' as const },
      { cell: maze[current.x]?.[current.z + 1], dir: 'bottom' as const, opposite: 'top' as const },
      { cell: maze[current.x - 1]?.[current.z], dir: 'left' as const, opposite: 'right' as const },
    ].filter((n) => n.cell && !visited.has(`${n.cell.x},${n.cell.z}`));
    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      current.walls[next.dir] = false;
      next.cell!.walls[next.opposite] = false;
      visited.add(`${next.cell!.x},${next.cell!.z}`);
      stack.push(next.cell!);
    }
  }
  return maze;
}
