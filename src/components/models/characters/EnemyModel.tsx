/*
敵用のキャラクターモデル
プレイヤーと同じhitogataモデルを使用し、色を変更して敵として表示
*/

import * as THREE from 'three';
import React from 'react';
import { useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { GLTF, SkeletonUtils } from 'three-stdlib';

export type EnemyModelProps = {
  position?: THREE.Vector3 | [number, number, number] | number;
  rotation?: THREE.Euler | [number, number, number];
  scale?: THREE.Vector3 | [number, number, number] | number;
  /** 移動中なら歩行モーションを再生 */
  play?: boolean;
  /** 敵の色（カラーコード） */
  color?: string;
  children?: React.ReactNode;
  dispose?: unknown;
  [key: string]: unknown;
};

type ActionName = 'アーマチュアアクション';

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    立方体002: THREE.SkinnedMesh;
    Root: THREE.Bone;
  };
  materials: {
    kuro: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function EnemyModel(props: EnemyModelProps) {
  const { play, color = '#ff4444', ...groupProps } = props;
  const group = React.useRef<THREE.Group | null>(null);
  const { scene, animations } = useGLTF('/models/3D/glb/hitogata/hitogata_move.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group as React.RefObject<THREE.Object3D>);

  // 敵用のマテリアルを作成（色を変更）
  const enemyMaterial = React.useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.7,
      metalness: 0.1,
    });
  }, [color]);

  // アニメーション制御（プレイヤーと同様）
  React.useEffect(() => {
    const action = actions?.['アーマチュアアクション'];
    if (!action) return;

    const ENEMY_WALK_SPEED = 1.2; // 敵の歩行速度倍率

    if (play) {
      // 移動中: 歩行アニメーションを再生
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.reset();
      action.setEffectiveWeight(1);
      action.setEffectiveTimeScale(ENEMY_WALK_SPEED);
      action.fadeIn(0.15);
      action.play();
    } else {
      // 静止中: アニメーションを停止
      action.stop();
    }

    return () => {
      action.stop();
    };
  }, [actions, play]);

  return (
    <group ref={group} {...groupProps} dispose={null}>
      <group name="Scene">
        <group name="アーマチュア">
          <primitive object={nodes.Root} />
          <skinnedMesh
            name="立方体002"
            geometry={nodes.立方体002.geometry}
            material={enemyMaterial}
            skeleton={nodes.立方体002.skeleton}
            castShadow
            receiveShadow
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/3D/glb/hitogata/hitogata_move.glb');
