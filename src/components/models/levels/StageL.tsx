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
  return <primitive object={gltf.scene} {...props} />;
}

useGLTF.preload('/models/3D/glb/stage1/stage_L.glb');

export default Model;
