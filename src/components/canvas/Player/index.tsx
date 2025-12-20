import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useKeyboard } from '../../../hooks/useKeyboard';
import {
  MOVE_SPEED,
  JUMP_FORCE,
  MOUSE_SENSITIVITY,
  GROUNDED_RAY_DISTANCE,
  CAMERA_HEIGHT,
  CAMERA_BACK_OFFSET,
  PLAYER_HALF_HEIGHT,
} from '../../../constants/player';
import { STAGE_SPAWN } from '../../../constants/stages';
import * as THREE from 'three';
import { Model as PlayerModel } from '../../models/characters/Player';
import useGameStore from '../../../stores/useGameStore';
import Weapon from '../Weapon/Weapon';

export default function Player() {
  const playerRef = useRef<RapierRigidBody>(null);
  const { camera, gl, scene } = useThree();
  const keys = useKeyboard();
  const stageId = useGameStore((s) => s.stageId);

  const spawn = useMemo(() => STAGE_SPAWN[stageId] ?? ([0, 5, 0] as const), [stageId]);

  // カメラの回転角度
  const rotationRef = useRef({ yaw: 0, pitch: 0 });
  // モデルの参照（見た目の回転をここで制御する）
  const modelRef = useRef<THREE.Group | null>(null);
  // 表示状態をレンダー側に渡すための state
  const [isMoving, setIsMoving] = useState(false);
  const [headPitchState, setHeadPitchState] = useState(0);
  const footstepAudioRef = useRef<HTMLAudioElement | null>(null);
  // ジャンプ押下の立ち上がり検出用
  const prevJumpRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const audio = new Audio('/sounds/footstep.mp3');
    audio.loop = true;
    audio.volume = 0.07;
    footstepAudioRef.current = audio;
    return () => {
      audio.pause();
      footstepAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = footstepAudioRef.current;
    if (!audio) return undefined;

    if (isMoving) {
      audio.play().catch(() => {
        // 自動再生制限で失敗するケースは握りつぶす
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isMoving]);

  const gameState = useGameStore((s) => s.gameState);

  // ポインターロックの設定
  useEffect(() => {
    const dom = gl.domElement;
    if (!dom) return;

    const handleClick = (e: MouseEvent) => {
      // 左クリックのみポインタロックを要求（UI 要素の誤トリガを防ぐ）
      if (e.button !== 0) return;
      // ポーズ/メニュー中はロックしない
      if (useGameStore.getState().gameState !== 'playing') return;
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

    // ポインタロックの状態変化を監視して、ユーザーが Esc でロックを解除した場合はゲームをポーズにする
    const handlePointerLockChange = () => {
      // lock が解除された（pointerLockElement が null または別要素）場合
      if (document.pointerLockElement !== dom) {
        if (useGameStore.getState().gameState === 'playing') {
          useGameStore.getState().setGameState('paused');
        }
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      dom.removeEventListener('click', handleClick);
      dom.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [gl.domElement]);

  // リスポーン要求を監視してプレイヤーをスポーン地点へ戻す
  const respawnToken = useGameStore((s) => s.respawnToken);
  useEffect(() => {
    // token が増えるたびにスポーン
    if (!playerRef.current) return;
    // setLinvel で速度をリセットし、位置をスポーン位置に即時移動する
    try {
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      playerRef.current.setTranslation({ x: spawn[0], y: spawn[1], z: spawn[2] }, true);
    } catch (e) {
      // ランタイムで API が違う場合に備えて安全に握りつぶす
      // （多くの環境では setTranslation が利用可能です）
      // 代替: 位置取得/代入が必要ならここで対応
      console.warn('Respawn: unable to call setTranslation on RigidBody', e);
    }
    // ジャンプ検出のフラグをクリア
    prevJumpRef.current = false;
  }, [respawnToken, spawn]);

  // 毎フレームの更新
  useFrame(() => {
    // ゲームが再生中でなければ更新を行わない（ポーズでの停止）
    if (gameState !== 'playing') return;

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

    // レンダーへ渡す状態を更新
    setIsMoving(direction.length() > 0.01);
    setHeadPitchState(rotationRef.current.pitch);

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
    // カメラはプレイヤー中心 + 半高 + 任意のオフセットに配置し、プレイヤーの向きに合わせて後方に引く
    const camOffset = new THREE.Vector3(0, PLAYER_HALF_HEIGHT + CAMERA_HEIGHT, -CAMERA_BACK_OFFSET);
    camOffset.applyEuler(new THREE.Euler(0, rotationRef.current.yaw, 0));
    camera.position.set(
      position.x + camOffset.x,
      position.y + camOffset.y,
      position.z + camOffset.z
    );
    camera.rotation.set(rotationRef.current.pitch, rotationRef.current.yaw, 0);

    // モデルの回転をカメラのヨーに合わせる（滑らかに追従）
    if (modelRef.current) {
      const currentY = modelRef.current.rotation.y;
      const targetY = rotationRef.current.yaw;
      modelRef.current.rotation.y = THREE.MathUtils.lerp(currentY, targetY, 0.12);
    }
  });

  return (
    <>
      <RigidBody
        name="player"
        ref={playerRef}
        colliders="ball"
        mass={1}
        position={spawn}
        enabledRotations={[false, false, false]}
        linearDamping={0.5}
      >
        {/* モデルは縮小して表示。コライダー中心に合わせて位置を調整 */}
        <group
          ref={modelRef}
          position={[0, -PLAYER_HALF_HEIGHT * (1 / 3), 0]}
          scale={[1 / 3, 1 / 3, 1 / 3]}
        >
          <PlayerModel play={isMoving} headPitch={headPitchState} />
        </group>
      </RigidBody>

      <Weapon playerRef={playerRef} isShooting={keys.shoot} cameraRotationRef={rotationRef} />
    </>
  );
}
