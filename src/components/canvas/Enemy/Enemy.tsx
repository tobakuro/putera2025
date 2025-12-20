import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { ENEMY_STATS } from '../../../constants/enemies';
import useGameStore from '../../../stores/useGameStore';
import type { Enemy as EnemyData } from '../../../stores/useGameStore';
import { EnemyModel } from '../../models/characters/EnemyModel';
import { PLAYER_HALF_HEIGHT } from '../../../constants/player';

interface EnemyProps {
  enemy: EnemyData;
  playerPosition: THREE.Vector3;
}

export default function Enemy({ enemy, playerPosition }: EnemyProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const modelGroupRef = useRef<THREE.Group>(null);
  const lastAttackTimeRef = useRef<number>(0);
  const [isMoving, setIsMoving] = useState(false);
  const updateEnemyPosition = useGameStore((s) => s.updateEnemyPosition);
  const removeEnemy = useGameStore((s) => s.removeEnemy);
  const takeDamage = useGameStore((s) => s.takeDamage);

  const stats = ENEMY_STATS[enemy.type];
  const ATTACK_COOLDOWN = 1.0; // 攻撃間隔（秒）

  // 敵が死んだら削除
  useEffect(() => {
    if (enemy.health <= 0) {
      removeEnemy(enemy.id);
    }
  }, [enemy.health, enemy.id, removeEnemy]);

  useFrame((state) => {
    if (!bodyRef.current || !modelGroupRef.current) return;

    const body = bodyRef.current;
    const currentPos = body.translation();
    const currentVec = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);
    const currentTime = state.clock.getElapsedTime();

    // プレイヤーとの距離を計算
    const distanceToPlayer = currentVec.distanceTo(playerPosition);

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

        // プレイヤーにダメージを与える（クールダウン付き）
        if (currentTime - lastAttackTimeRef.current >= ATTACK_COOLDOWN) {
          takeDamage(stats.damage);
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

    // 移動状態を更新
    setIsMoving(moving);

    // 位置をストアに反映（他のシステムで使用できるように）
    const pos = body.translation();
    updateEnemyPosition(enemy.id, [pos.x, pos.y, pos.z]);
  });

  return (
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
        <group position={[0, 2.5, 0]}>
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
  );
}
