// Gun constants
export const PISTOL_DAMAGE = 1; //1発あたりのダメージ
export const PISTOL_AMMO = 12; //1マガジンあたりの弾数
export const PISTOL_RELOAD = 1.5; //リロード時間（秒）
export const PISTOL_FIRE_RATE = 0.2; //連射速度（秒）

// 弾薬システムの定数
export const INITIAL_CURRENT_AMMO = 15; //ゲーム開始時の装弾数（マガジン内）
export const MAX_AMMO = 15; //マガジンの最大装弾数
export const INITIAL_RESERVE_AMMO = 15; //ゲーム開始時の予備弾数（マガジン外）
export const MAX_RESERVE_AMMO = 45; //予備弾の最大所持数（マガジン外）

//弾の定数
export const BULLET_SPEED = 75; //弾の速度
export const BULLET_LIFETIME = 3; //弾が消えるまでの時間（秒）
export const BULLET_RADIUS = 0.05; //弾の半径

//敵の弾の定数
export const ENEMY_BULLET_SPEED = 10; //敵の弾の速度（プレイヤーより遅い）
export const ENEMY_BULLET_LIFETIME = 10; //敵の弾が消えるまでの時間（秒）
export const ENEMY_BULLET_SCALE = 0.5; //敵の弾のスケール（プレイヤーより大きい）
