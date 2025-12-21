import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, interactionGroups } from '@react-three/rapier';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import {
  PISTOL_FIRE_RATE,
  PISTOL_DAMAGE,
  BULLET_SPEED,
  BULLET_LIFETIME,
} from '../../../constants/weapons';
import useGameStore from '../../../stores/useGameStore';
import { ENEMY_STATS } from '../../../constants/enemies';
import { perfEnd, perfStart } from '../../../utils/perf';

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

  // 銃声のAudioオブジェクトを作成
  const shootSound = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const audio = new Audio('/sounds/銃声２.mp3');
    audio.volume = 0.3;
    return audio;
  }, []);

  // 弾が消える処理(発射されてから消えるまでの時間は定数をいじってね)
  useFrame((state) => {
    if (gameState !== 'playing') return;
    const tPerf = perfStart('Weapon.bullets');
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
    perfEnd(tPerf);
  });

  const shoot = (currentTime: number) => {
    if (!playerRef.current || !cameraRotationRef.current) return;

    // 銃声を再生
    if (shootSound) {
      shootSound.currentTime = 0; // 連続で撃った時に最初から再生されるようにする
      shootSound.play().catch((e) => console.warn('Audio play failed:', e));
    }

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
      {/* 1人称視点の武器モデル */}
      <WeaponModel camera={camera} />

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
  const addScore = useGameStore((s) => s.addScore);

  const MODEL_PATH = '/models/3D/glb/dangan/dangan.glb';
  const { scene } = useGLTF(MODEL_PATH) as { scene: THREE.Group };
  const cloned = useMemo(() => scene.clone(), [scene]);
  const { camera } = useThree();
  const visualRef = useRef<THREE.Group | null>(null);

  // 衝突（壁/地形/敵）を検出
  const handleCollision = ({ other }: { other: { rigidBodyObject?: { userData?: unknown } } }) => {
    if (hasHit) return;

    const ud = other?.rigidBodyObject?.userData;
    const udObj = ud && typeof ud === 'object' ? (ud as Record<string, unknown>) : null;

    // 敵の RigidBody には Enemy.tsx で userData: { type: 'enemy', id } を設定済み
    if (udObj?.type === 'enemy' && typeof udObj?.id === 'string') {
      const enemyId = udObj.id;
      const enemy = useGameStore.getState().enemies.find((e) => e.id === enemyId);
      if (enemy) {
        const newHealth = Math.max(0, enemy.health - PISTOL_DAMAGE);
        updateEnemyHealth(enemy.id, newHealth);
        if (newHealth <= 0) {
          const scoreValue = ENEMY_STATS[enemy.type].scoreValue;
          addScore(scoreValue);
        }
      }
    }

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

    // 毎フレーム、モデルの底面がカメラを向くように回転を設定する
    const vis = visualRef.current;
    if (vis) {
      const worldPos = new THREE.Vector3();
      vis.getWorldPosition(worldPos);
      const toCam = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
      const fromVec = new THREE.Vector3(0, -1, 0);
      const q = new THREE.Quaternion().setFromUnitVectors(fromVec, toCam);
      vis.quaternion.slerp(q, 0.3);
    }
  });

  // 弾が当たったら表示しない
  if (hasHit) {
    return null;
  }
  // NOTE: hooks (useGLTF/useMemo) are called above to ensure consistent hook order.
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
      onCollisionEnter={handleCollision} // 壁/地形/敵との衝突時に弾を無効化（敵の場合はここでダメージ適用）
    >
      {/* visualRef を使って毎フレームカメラ方向に底面を向ける */}
      <group ref={visualRef} scale={[0.2, 0.2, 0.2]}>
        <primitive object={cloned} />
      </group>
    </RigidBody>
  );
}

// preload model for smoother first render
useGLTF.preload('/models/3D/glb/dangan/dangan.glb');

type WeaponModelProps = {
  camera: THREE.Camera;
};

function WeaponModel({ camera }: WeaponModelProps) {
  const WEAPON_MODEL_PATH = '/models/3D/glb/gun/gun_only.glb';
  const { scene } = useGLTF(WEAPON_MODEL_PATH) as { scene: THREE.Group };
  const weaponRef = useRef<THREE.Group>(null);
  const cameraMode = useGameStore((s) => s.cameraMode);

  useFrame(() => {
    if (!weaponRef.current) return;

    // カメラの位置と回転に追従
    weaponRef.current.position.copy(camera.position);
    weaponRef.current.rotation.copy(camera.rotation);

    // 画面右下にオフセット（より右でさらに下に配置、さらに手前に）
    const rightOffset = new THREE.Vector3(0.5, -0.4, -0.1);
    rightOffset.applyQuaternion(camera.quaternion);
    weaponRef.current.position.add(rightOffset);

    // 銃口部分だけが見えるように回転調整
    weaponRef.current.rotateX(0.1);
    weaponRef.current.rotateY(0.2 + Math.PI + Math.PI / 2 + Math.PI); // Y軸にさらに180度
    weaponRef.current.rotateZ(-Math.PI / 2 + Math.PI / 2); // Z軸にさらに90度
  });

  return (
    <group ref={weaponRef} scale={[0.04, 0.04, 0.04]}>
      {cameraMode === 'first' && <primitive object={scene.clone()} />}
    </group>
  );
}
