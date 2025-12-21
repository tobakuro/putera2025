import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

export type EnergyWeaponProps = {
  level?: 1 | 2 | 3 | 4;
  position?: THREE.Vector3 | [number, number, number];
  rotation?: THREE.Euler | [number, number, number];
  scale?: THREE.Vector3 | [number, number, number] | number;
};

export const EnergyWeapon = React.forwardRef<THREE.Group, EnergyWeaponProps>(
  ({ level = 4, ...props }, ref) => {
    const { scene } = useGLTF(`/models/3D/glb/energy_weapon_lv${level}.glb`);

    // SkeletonUtils.clone()を使用してメモリリークを防ぐ
    const clonedScene = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);

    return (
      <group ref={ref} {...props}>
        <primitive object={clonedScene} />
      </group>
    );
  }
);

EnergyWeapon.displayName = 'EnergyWeapon';

// Preload the weapon models
useGLTF.preload('/models/3D/glb/energy_weapon_lv1.glb');
useGLTF.preload('/models/3D/glb/energy_weapon_lv2.glb');
useGLTF.preload('/models/3D/glb/energy_weapon_lv3.glb');
useGLTF.preload('/models/3D/glb/energy_weapon_lv4.glb');
