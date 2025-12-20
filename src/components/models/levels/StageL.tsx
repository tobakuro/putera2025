/*
  Minimal loader for the new large stage model (stage_L.glb)
  Loads from public/ so URL is '/models/3D/glb/stage1/stage_L.glb'
*/

import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

export type GroupProps = {
  position?: THREE.Vector3 | [number, number, number] | number;
  rotation?: THREE.Euler | [number, number, number];
  scale?: THREE.Vector3 | [number, number, number] | number;
  children?: React.ReactNode;
  dispose?: unknown;
  [key: string]: unknown;
};

export function Model(props: GroupProps) {
  const gltf = useGLTF('/models/3D/glb/stage1/stage_L.glb') as unknown as GLTF;
  // 一括で地形タグ付け（接地判定のレイキャスト対象キャッシュ用）
  React.useMemo(() => {
    gltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        if (!obj.userData?.type) obj.userData = { ...obj.userData, type: 'ground' };
      }
    });
    return null;
  }, [gltf.scene]);
  return <primitive object={gltf.scene} {...props} />;
}

useGLTF.preload('/models/3D/glb/stage1/stage_L.glb');

export default Model;
