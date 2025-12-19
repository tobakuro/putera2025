export const MOVE_SPEED = 5; // 単位: m/s
// ワールドの重力（Scene の Physics と合わせる）
export const GRAVITY = 9.81; // 単位: m/s^2

// プレイヤー用のカプセルコライダー寸法
export const PLAYER_RADIUS = 0.5; // 単位: m
export const PLAYER_BODY_LENGTH = 1; // capsule args: [radius, length]
export const PLAYER_HALF_HEIGHT = (PLAYER_BODY_LENGTH + 2 * PLAYER_RADIUS) / 2;

// ジャンプの到達高さ（メートル） — ここを調整してジャンプの高さを変えてください
export const JUMP_HEIGHT = 20.0; // 単位: m

// ジャンプに必要な初速（impulse）は v = sqrt(2*g*h)、質量を 1 と仮定している
export const JUMP_FORCE = Math.sqrt(2 * GRAVITY * JUMP_HEIGHT);
// マウス感度
export const MOUSE_SENSITIVITY = 0.002;

// プレイヤーが地面に接地していると判断するための閾値（垂直速度の絶対値）
export const GROUNDED_EPS = 0.1;

// 接地判定用のレイキャスト距離（プレイヤーの底からどれだけ離れていれば空中と判断するか）
// 接地判定のマージン（プレイヤー半高に足す許容値）
export const GROUNDED_RAY_DISTANCE = 0.15; // 単位: m

// カメラの相対高さ（プレイヤー位置に対するオフセット）

// ここを上げてプレイヤー視点をやや高めにする
export const CAMERA_HEIGHT = 1.0; // 単位: m
// カメラをプレイヤーの後方に下がらせる距離（m）
export const CAMERA_BACK_OFFSET = -3.2; // 正の値で後方へ

// 歩行アニメの再生速度倍率（1.0 = 元の速度）
export const WALK_SPEED = 1.6;
