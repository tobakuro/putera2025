import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { ENEMY_STATS } from '../../../constants/enemies';
import useGameStore from '../../../stores/useGameStore';
import type { Enemy as EnemyData } from '../../../stores/useGameStore';
import { EnemyModel } from '../../models/characters/EnemyModel';
import { PLAYER_HALF_HEIGHT } from '../../../constants/player';
import { perfEnd, perfStart } from '../../../utils/perf';
import EnemyBullet from './EnemyBullet';

type EnemyBulletData = {
  id: number;
  createdAt: number;
  startPosition: THREE.Vector3;
  direction: THREE.Vector3;
};

interface EnemyProps {
  enemy: EnemyData;
  playerPosition: THREE.Vector3;
}

let enemyBulletIdCounter = 0;

export default function Enemy({ enemy, playerPosition }: EnemyProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const modelGroupRef = useRef<THREE.Group>(null);
  const hpGroupRef = useRef<THREE.Group>(null);
  const lastAttackTimeRef = useRef<number>(0);
  const lastMovingRef = useRef<boolean>(false);
  const lastPosSyncTimeRef = useRef<number>(0);
  const lastAiUpdateRef = useRef<number>(0);
  const [isMoving, setIsMoving] = useState(false);
  const updateEnemyPosition = useGameStore((s) => s.updateEnemyPosition);
  const removeEnemy = useGameStore((s) => s.removeEnemy);
  const takeDamage = useGameStore((s) => s.takeDamage);
  const gameState = useGameStore((s) => s.gameState);

  // スナイパー用の弾丸管理
  const [bullets, setBullets] = useState<EnemyBulletData[]>([]);

  const stats = ENEMY_STATS[enemy.type];
  const ATTACK_COOLDOWN = 1.0; // 攻撃間隔（秒）

  // スナイパー用の弾丸発射関数
  const shootBullet = (currentTime: number) => {
    if (!bodyRef.current) return;

    const enemyPos = bodyRef.current.translation();

    // プレイヤーへの方向を計算
    const direction = new THREE.Vector3(
      playerPosition.x - enemyPos.x,
      playerPosition.y - enemyPos.y,
      playerPosition.z - enemyPos.z
    ).normalize();

    // 発射位置: 敵の胸の高さから、プレイヤー方向に1m前方にオフセット
    // これにより弾が敵のコライダーと重ならないようにする
    const forwardOffset = direction.clone().multiplyScalar(1.0);
    const startPosition = new THREE.Vector3(
      enemyPos.x + forwardOffset.x,
      enemyPos.y + 1.5 + forwardOffset.y, // 敵の胸の高さから発射
      enemyPos.z + forwardOffset.z
    );

    const bulletData: EnemyBulletData = {
      id: enemyBulletIdCounter++,
      createdAt: currentTime,
      startPosition: startPosition,
      direction: direction,
    };

    setBullets((prev) => [...prev, bulletData]);
  };

  // HPバーを常にカメラに向ける（ビルボード） — Y軸回転のみを行い傾きを防ぐ
  useFrame((state) => {
    if (hpGroupRef.current) {
      const worldPos = new THREE.Vector3();
      hpGroupRef.current.getWorldPosition(worldPos);
      const camPos = state.camera.position;
      const dx = camPos.x - worldPos.x;
      const dz = camPos.z - worldPos.z;
      const angle = Math.atan2(dx, dz);
      // X/Z 平面のみで回転を設定して傾きを防ぐ
      hpGroupRef.current.rotation.set(0, angle, 0);
    }
  });

  // 弾丸の削除ハンドラー
  const handleBulletExpire = (bulletId: number) => {
    setBullets((prev) => prev.filter((b) => b.id !== bulletId));
  };

  // 敵が死んだら削除
  useEffect(() => {
    if (enemy.health <= 0) {
      removeEnemy(enemy.id);
    }
  }, [enemy.health, enemy.id, removeEnemy]);

  useFrame((state) => {
    // ゲームが再生中でなければ敵のAIを停止
    if (gameState !== 'playing') return;
    if (!bodyRef.current || !modelGroupRef.current) return;

    const tPerf = perfStart('Enemy.ai');

    const body = bodyRef.current;
    const currentPos = body.translation();
    const currentVec = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);
    const currentTime = state.clock.getElapsedTime();

    // プレイヤーとの距離を計算
    const distanceToPlayer = currentVec.distanceTo(playerPosition);

    // 更新頻度は距離に応じて間引く
    //  - 近距離: フル更新
    //  - 中距離: 低頻度更新 (0.1s)
    //  - 遠距離: 更に低頻度更新 (0.5s)
    const FULL_UPDATE_DIST = Math.min(8, stats.detectionRange); // 近距離閾値
    const MID_UPDATE_DIST = Math.max(15, stats.detectionRange * 0.8); // 中距離閾値
    const MID_TICK = 0.1;
    const FAR_TICK = 0.5;

    if (distanceToPlayer <= FULL_UPDATE_DIST) {
      // 近距離はフル更新
    } else if (distanceToPlayer <= MID_UPDATE_DIST) {
      // 中距離は間引き
      if (currentTime - lastAiUpdateRef.current < MID_TICK) return;
    } else {
      // 遠距離は更に間引き
      if (currentTime - lastAiUpdateRef.current < FAR_TICK) return;
    }
    lastAiUpdateRef.current = currentTime;

    let moving = false;

    // プレイヤーが検知範囲内にいる場合
    if (distanceToPlayer < stats.detectionRange) {
      // プレイヤーへの方向ベクトルを計算（Y軸は無視して水平移動のみ）
      const direction = new THREE.Vector3(
        playerPosition.x - currentPos.x,
        0,
        playerPosition.z - currentPos.z
      ).normalize();

      // 攻撃範囲内かチェック
      if (distanceToPlayer < stats.attackRange) {
        // 攻撃範囲内では移動を停止
        body.setLinvel({ x: 0, y: body.linvel().y, z: 0 }, true);
        moving = false;

        // 攻撃処理（クールダウン付き）
        if (currentTime - lastAttackTimeRef.current >= ATTACK_COOLDOWN) {
          if (enemy.type === 'sniper') {
            // スナイパーは弾を発射
            shootBullet(currentTime);
          } else {
            // 他の敵は近接攻撃
            takeDamage(stats.damage, `Enemy:${enemy.type}`, currentTime);
          }
          lastAttackTimeRef.current = currentTime;
        }
      } else {
        // プレイヤーに向かって移動
        const velocity = direction.multiplyScalar(stats.speed);
        body.setLinvel(
          {
            x: velocity.x,
            y: body.linvel().y, // 重力は保持
            z: velocity.z,
          },
          true
        );
        moving = true;
      }

      // プレイヤーの方を向く
      const angle = Math.atan2(direction.x, direction.z);
      modelGroupRef.current.rotation.y = angle;
    } else {
      // 検知範囲外では停止
      body.setLinvel({ x: 0, y: body.linvel().y, z: 0 }, true);
      moving = false;
    }

    // 移動状態は変化したときだけReact stateを更新
    if (moving !== lastMovingRef.current) {
      lastMovingRef.current = moving;
      setIsMoving(moving);
    }

    // 位置のストア反映は間引き（10Hz）して負荷を低減
    if (currentTime - lastPosSyncTimeRef.current >= 0.1) {
      lastPosSyncTimeRef.current = currentTime;
      const pos = body.translation();
      updateEnemyPosition(enemy.id, [pos.x, pos.y, pos.z]);
    }

    perfEnd(tPerf);
  });

  return (
    <>
      <RigidBody
        ref={bodyRef}
        type="dynamic"
        position={enemy.position}
        colliders={false}
        lockRotations
        linearDamping={0.5}
        name={`enemy-${enemy.id}`}
        userData={{ type: 'enemy', id: enemy.id }}
      >
        {/* 人型に適したカプセルコライダー（縦長の円柱＋半球） */}
        <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.5, 0]} />

        {/* 3Dモデルの表示 */}
        <group
          ref={modelGroupRef}
          position={[0, -PLAYER_HALF_HEIGHT * (1 / 3), 0]}
          scale={[1 / 3, 1 / 3, 1 / 3]}
        >
          <EnemyModel play={isMoving} color={stats.color} />
        </group>

        {/* HPバーの表示（敵の上部） */}
        {enemy.health > 0 && (
          <group ref={hpGroupRef} position={[0, 2.5, 0]}>
            {/* 背景（赤） */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[1, 0.1]} />
              <meshBasicMaterial
                color="#ff0000"
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            {/* HP（緑） */}
            <mesh
              position={[-0.5 * (1 - Math.max(0.01, enemy.health / stats.maxHealth)), 0, 0.01]}
              scale={[Math.max(0.01, enemy.health / stats.maxHealth), 1, 1]}
            >
              <planeGeometry args={[1, 0.1]} />
              <meshBasicMaterial
                color="#00ff00"
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        )}
      </RigidBody>

      {/* スナイパーの弾丸をレンダリング（敵のRigidBodyの外側に独立して配置） */}
      {enemy.type === 'sniper' &&
        bullets.map((bullet) => (
          <EnemyBullet
            key={bullet.id}
            id={bullet.id}
            startPosition={bullet.startPosition}
            direction={bullet.direction}
            createdAt={bullet.createdAt}
            damage={stats.damage}
            onExpire={handleBulletExpire}
          />
        ))}
    </>
  );
}
