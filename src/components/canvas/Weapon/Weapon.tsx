import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import {
  PISTOL_FIRE_RATE,
  BULLET_SPEED,
  BULLET_LIFETIME,
  BULLET_RADIUS,
} from '../../../constants/weapons';

type BulletData = {
  id: number;
  ref: React.RefObject<RapierRigidBody | null>;
  createdAt: number;
  startPosition: THREE.Vector3;
  direction: THREE.Vector3;
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

  // 弾が消える処理(発射されてから消えるまでの時間は定数をいじってね)
  useFrame((state) => {
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

    // カメラの向きから発射方向を計算
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyEuler(
      new THREE.Euler(cameraRotationRef.current.pitch, cameraRotationRef.current.yaw, 0, 'YXZ')
    );
    direction.normalize();

    // 弾の初期位置はカメラ位置から少し前方にしてます
    const bulletRef = React.createRef<RapierRigidBody | null>();
    const id = bulletIdCounter++;

    bullets.current.push({
      id,
      ref: bulletRef,
      createdAt: currentTime,
      startPosition: camera.position.clone(),
      direction: direction.clone(),
    });
  };

  return (
    <>
      {bullets.current.map((bullet) => (
        <Bullet
          key={bullet.id}
          bulletRef={bullet.ref}
          startPosition={bullet.startPosition}
          direction={bullet.direction}
        />
      ))}
    </>
  );
}

type BulletProps = {
  bulletRef: React.RefObject<RapierRigidBody | null>;
  startPosition: THREE.Vector3;
  direction: THREE.Vector3;
};

function Bullet({ bulletRef, startPosition, direction }: BulletProps) {
  const hasAppliedVelocity = useRef(false);

  // RigidBodyが準備できていることを保証するためにuseFrame内で速度を適用
  useFrame(() => {
    if (!bulletRef.current) return;

    // 一度だけ速度を適用
    if (!hasAppliedVelocity.current) {
      const velocity = direction.clone().multiplyScalar(BULLET_SPEED);
      bulletRef.current.setLinvel(velocity, true);
      hasAppliedVelocity.current = true;
    }

    // TODO: 敵との衝突をチェックしてダメージを与える処理
    // 敵システムが追加されたら実装予定
  });

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
    >
      <mesh>
        <sphereGeometry args={[BULLET_RADIUS, 8, 8]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
    </RigidBody>
  );
}
