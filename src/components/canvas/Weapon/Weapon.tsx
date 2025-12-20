import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, interactionGroups } from '@react-three/rapier';
import * as THREE from 'three';
import {
  PISTOL_FIRE_RATE,
  PISTOL_DAMAGE,
  BULLET_SPEED,
  BULLET_LIFETIME,
  BULLET_RADIUS,
} from '../../../constants/weapons';
import useGameStore from '../../../stores/useGameStore';
import { ENEMY_STATS } from '../../../constants/enemies';

type BulletData = {
  id: number;
  createdAt: number;
  startPosition: THREE.Vector3;
  direction: THREE.Vector3;
  hasHit: boolean; // 弾が何かに当たったかのフラグ
};

type WeaponProps = {
  playerRef: React.RefObject<RapierRigidBody | null>;
  isShooting: boolean;
  cameraRotationRef: React.RefObject<{ yaw: number; pitch: number }>;
};

let bulletIdCounter = 0;

export default function Weapon({ playerRef, isShooting, cameraRotationRef }: WeaponProps) {
  const { camera } = useThree();
  const bullets = useRef<BulletData[]>([]);
  const lastShotTime = useRef(0);
  const prevShootingRef = useRef(false);
  const gameState = useGameStore((s) => s.gameState);

  // 弾が消える処理(発射されてから消えるまでの時間は定数をいじってね)
  useFrame((state) => {
    if (gameState !== 'playing') return;
    const now = state.clock.getElapsedTime();

    bullets.current = bullets.current.filter((bullet) => {
      const age = now - bullet.createdAt;
      if (age > BULLET_LIFETIME) {
        return false;
      }
      return true;
    });

    // 左クリック長押しで連射しないように制御
    const risingEdge = isShooting && !prevShootingRef.current;
    if (risingEdge && now - lastShotTime.current >= PISTOL_FIRE_RATE) {
      shoot(now);
      lastShotTime.current = now;
    }
    prevShootingRef.current = isShooting;
  });

  const shoot = (currentTime: number) => {
    if (!playerRef.current || !cameraRotationRef.current) return;

    // レイキャストを使用して画面中央（クロスヘア）から発射方向を計算
    const raycaster = new THREE.Raycaster();

    // 画面中央の正規化デバイス座標（NDC）は (0, 0)
    const screenCenter = new THREE.Vector2(0, 0);
    raycaster.setFromCamera(screenCenter, camera);

    // レイの方向を取得（これがクロスヘアが指している方向）
    const direction = raycaster.ray.direction.clone().normalize();

    // 弾の初期位置はカメラ位置から少し前方
    const offset = direction.clone().multiplyScalar(0.5);
    const startPosition = camera.position.clone().add(offset);

    const id = bulletIdCounter++;

    bullets.current.push({
      id,
      createdAt: currentTime,
      startPosition: startPosition,
      direction: direction.clone(),
      hasHit: false,
    });
  };

  return (
    <>
      {bullets.current.map((bullet) => (
        <Bullet key={bullet.id} startPosition={bullet.startPosition} direction={bullet.direction} />
      ))}
    </>
  );
}

type BulletProps = {
  startPosition: THREE.Vector3;
  direction: THREE.Vector3;
};

function Bullet({ startPosition, direction }: BulletProps) {
  const bulletRef = useRef<RapierRigidBody>(null);
  const hasAppliedVelocity = useRef(false);
  const [hasHit, setHasHit] = useState(false);
  const updateEnemyHealth = useGameStore((s) => s.updateEnemyHealth);
  const enemies = useGameStore((s) => s.enemies);
  const addScore = useGameStore((s) => s.addScore);

  // 壁や地形との衝突を検出
  const handleCollision = () => {
    setHasHit(true);
  };

  // RigidBodyが準備できていることを保証するためにuseFrame内で速度を適用
  useFrame(() => {
    if (useGameStore.getState().gameState !== 'playing') return;
    if (!bulletRef.current || hasHit) return;

    // 一度だけ速度を適用
    if (!hasAppliedVelocity.current) {
      const velocity = direction.clone().multiplyScalar(BULLET_SPEED);
      bulletRef.current.setLinvel(velocity, true);
      hasAppliedVelocity.current = true;
    }

    // 敵との衝突をチェック（簡易的な距離ベースの判定）
    const bulletPos = bulletRef.current.translation();
    const bulletVec = new THREE.Vector3(bulletPos.x, bulletPos.y, bulletPos.z);

    enemies.forEach((enemy) => {
      if (hasHit) return;

      const enemyVec = new THREE.Vector3(...enemy.position);
      const distance = bulletVec.distanceTo(enemyVec);

      // 衝突判定（弾の半径 + 敵のサイズを考慮）
      const collisionThreshold = BULLET_RADIUS + 0.5; // 敵のサイズの半分程度
      if (distance < collisionThreshold) {
        // ダメージを与える
        const newHealth = Math.max(0, enemy.health - PISTOL_DAMAGE);
        updateEnemyHealth(enemy.id, newHealth);

        // 敵が倒れたらスコア加算
        if (newHealth <= 0) {
          const scoreValue = ENEMY_STATS[enemy.type].scoreValue;
          addScore(scoreValue);
        }

        // 弾を無効化
        setHasHit(true);
      }
    });
  });

  // 弾が当たったら表示しない
  if (hasHit) {
    return null;
  }

  return (
    <RigidBody
      ref={bulletRef}
      colliders="ball"
      mass={0.01}
      position={[startPosition.x, startPosition.y, startPosition.z]}
      gravityScale={0}
      ccd={true} // 高速移動物体のための連続衝突検出
      sensor={false} // センサーではない - 弾はオブジェクトと衝突する
      linearDamping={0} // 空気抵抗なし
      angularDamping={0} // 回転減衰なし
      collisionGroups={interactionGroups(2, [0, 3, 4, 5])} // グループ2（弾丸）: 地形・敵と衝突、プレイヤー（グループ1）とは衝突しない
      onCollisionEnter={handleCollision} // 壁や地形との衝突時に弾を無効化
    >
      <mesh>
        <sphereGeometry args={[BULLET_RADIUS, 8, 8]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
    </RigidBody>
  );
}
