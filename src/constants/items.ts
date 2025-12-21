import * as THREE from 'three';

// Ammoアイテムの定数
export const AMMO_RESTORE_AMOUNT = 15; // 拾った時に回復する予備弾数
export const AMMO_SPAWN_INTERVAL = 15; // 時間経過でのスポーン間隔（秒）
export const AMMO_SPAWN_PER_KILLS = 5; // 何体倒すごとにスポーンするか

// Ammoアイテムのスポーン座標（ステージごとに設定可能）
export const AMMO_SPAWN_POSITIONS: THREE.Vector3[] = [
  new THREE.Vector3(10, 2, 10),
  new THREE.Vector3(-10, 2, 10),
  new THREE.Vector3(10, 2, -10),
  new THREE.Vector3(-10, 2, -10),
  new THREE.Vector3(0, 2, 15),
  new THREE.Vector3(0, 2, -15),
];

// Ammoアイテムの3Dモデルパス
export const AMMO_MODEL_PATH = '/models/3D/glb/dangan/dangan.glb';

// Ammoアイテムの見た目設定
export const AMMO_SCALE = 1.0; // モデルのスケール
export const AMMO_ROTATION_SPEED = 1.0; // 回転速度（rad/s）
export const AMMO_BOB_SPEED = 2.0; // 上下運動の速度
export const AMMO_BOB_HEIGHT = 0.3; // 上下運動の高さ
export const AMMO_COLLIDER_RADIUS = 2.0; // 取得判定の半径（大きめに設定）
