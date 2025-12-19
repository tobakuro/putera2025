import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useKeyboard } from '../../../hooks/useKeyboard';
import {
  MOVE_SPEED,
  JUMP_FORCE,
  MOUSE_SENSITIVITY,
  GROUNDED_RAY_DISTANCE,
  CAMERA_HEIGHT,
} from '../../../constants/player';
import { PLAYER_HALF_HEIGHT } from '../../../constants/player';
import * as THREE from 'three';

export default function Player() {
  const playerRef = useRef<RapierRigidBody>(null);
  const { camera, gl, scene } = useThree();
  const keys = useKeyboard();

  // カメラの回転角度
  const rotationRef = useRef({ yaw: 0, pitch: 0 });
  // ジャンプ押下の立ち上がり検出用
  const prevJumpRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());

  // ポインターロックの設定
  useEffect(() => {
    const dom = gl.domElement;
    if (!dom) return;

    const handleClick = (e: MouseEvent) => {
      // 左クリックのみポインタロックを要求（UI 要素の誤トリガを防ぐ）
      if (e.button !== 0) return;
      // Canvas 要素へフォーカスがある場合のみロックする
      dom.requestPointerLock();
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Canvas がポインタロックしている場合のみカメラ回転を反映
      if (document.pointerLockElement === dom) {
        rotationRef.current.yaw -= e.movementX * MOUSE_SENSITIVITY;
        rotationRef.current.pitch -= e.movementY * MOUSE_SENSITIVITY;

        // ピッチ制限(上下の視点制限)
        rotationRef.current.pitch = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, rotationRef.current.pitch)
        );
      }
    };

    dom.addEventListener('click', handleClick);
    // マウスムーブは document ではなく canvas 自体で監視しておく（移動イベントはロック時にキャンバスで発火）
    dom.addEventListener('mousemove', handleMouseMove);

    return () => {
      dom.removeEventListener('click', handleClick);
      dom.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl.domElement]);

  // 毎フレームの更新
  useFrame(() => {
    if (!playerRef.current) return;

    const velocity = playerRef.current.linvel();
    const position = playerRef.current.translation();

    // 移動方向の計算
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0));
    const sideVector = new THREE.Vector3((keys.right ? 1 : 0) - (keys.left ? 1 : 0), 0, 0);

    direction
      .addVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVE_SPEED)
      .applyEuler(new THREE.Euler(0, rotationRef.current.yaw, 0));

    // 速度の更新(Y軸は維持)
    playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    // 接地判定: 中心から下向きにレイを飛ばし、ヒット距離が半高+マージン以内かを確認
    const rayOrigin = new THREE.Vector3(position.x, position.y, position.z);
    raycasterRef.current.set(rayOrigin, new THREE.Vector3(0, -1, 0));
    const intersects = scene ? raycasterRef.current.intersectObjects(scene.children, true) : [];
    const grounded =
      intersects.length > 0 && intersects[0].distance <= PLAYER_HALF_HEIGHT + GROUNDED_RAY_DISTANCE;

    // 立ち上がり検出でジャンプを発火（押し始めのみ）
    const rising = keys.jump && !prevJumpRef.current;
    if (rising && grounded) {
      playerRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
    }
    prevJumpRef.current = keys.jump;

    // カメラの位置と回転を更新
    camera.position.set(position.x, position.y + CAMERA_HEIGHT, position.z);
    camera.rotation.set(rotationRef.current.pitch, rotationRef.current.yaw, 0);
  });

  return (
    <RigidBody
      ref={playerRef}
      colliders="ball"
      mass={1}
      position={[0, 3, 0]}
      enabledRotations={[false, false, false]} // 回転を無効化(カプセル型の挙動)
      linearDamping={0.5}
    >
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#4a90e2" transparent opacity={0} />
      </mesh>
    </RigidBody>
  );
}
