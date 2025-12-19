export const MOVE_SPEED = 5;
// ワールドの重力（Scene の Physics と合わせる）
export const GRAVITY = 9.81;

// プレイヤー用のカプセルコライダー寸法
export const PLAYER_RADIUS = 0.5;
export const PLAYER_BODY_LENGTH = 1; // capsule args: [radius, length]
export const PLAYER_HALF_HEIGHT = (PLAYER_BODY_LENGTH + 2 * PLAYER_RADIUS) / 2;

// ジャンプの到達高さ（メートル） — ここを調整してジャンプの高さを変えてください
export const JUMP_HEIGHT = 20.0;

// ジャンプに必要な初速（impulse）は v = sqrt(2*g*h)、質量を 1 と仮定している
export const JUMP_FORCE = Math.sqrt(2 * GRAVITY * JUMP_HEIGHT);
export const SENSITIVITY = 0.002;

// プレイヤーが地面に接地していると判断するための閾値（垂直速度の絶対値）
export const GROUNDED_EPS = 0.1;

// 接地判定用のレイキャスト距離（プレイヤーの底からどれだけ離れていれば空中と判断するか）
// 接地判定のマージン（プレイヤー半高に足す許容値）
export const GROUNDED_RAY_DISTANCE = 0.15;

// カメラの相対高さ（プレイヤー位置に対するオフセット）
export const CAMERA_HEIGHT = 0.5;
