/*
  Minimal Stage loader — loads the GLB from the public folder.
  This file was corrupted; replace with a compact, resilient loader that
  returns the model scene as a primitive so the app can render the new GLB.
*/

import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

// Minimal GroupProps shape to avoid relying on project-wide JSX typings
export type GroupProps = {
  position?: THREE.Vector3 | [number, number, number] | number;
  rotation?: THREE.Euler | [number, number, number];
  scale?: THREE.Vector3 | [number, number, number] | number;
  children?: React.ReactNode;
  dispose?: unknown;
  [key: string]: unknown;
};

export function Model(props: GroupProps) {
  // Load from public/ so URL is '/models/3D/glb/stage1/stage.glb'
  const gltf = useGLTF('/models/3D/glb/stage1/stage.glb') as unknown as GLTF;
  return <primitive object={gltf.scene} {...props} />;
}

useGLTF.preload('/models/3D/glb/stage1/stage.glb');

export default Model;
