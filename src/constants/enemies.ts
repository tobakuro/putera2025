// 敵の種類を定義する型
export type EnemyType = 'basic' | 'fast' | 'tank' | 'sniper';

// 敵のステータスを定義するインターフェース
export interface EnemyStats {
  maxHealth: number; // 最大HP
  speed: number; // 移動速度 (m/s)
  damage: number; // プレイヤーへの接触ダメージ
  attackRange: number; // 攻撃範囲 (m)
  detectionRange: number; // プレイヤーを検知する範囲 (m)
  size: [number, number, number]; // [幅, 高さ, 奥行] (m)
  color: string; // 表示色
  scoreValue: number; // 撃破時のスコア
}

// 敵タイプ別のステータス定義
export const ENEMY_STATS: Record<EnemyType, EnemyStats> = {
  basic: {
    maxHealth: 100,
    speed: 3.0,
    damage: 10,
    attackRange: 1.5,
    detectionRange: 20,
    size: [1, 1.5, 1],
    color: '#ff4444',
    scoreValue: 100,
  },
  fast: {
    maxHealth: 50,
    speed: 6.0,
    damage: 5,
    attackRange: 1.0,
    detectionRange: 25,
    size: [0.7, 1.2, 0.7],
    color: '#44ff44',
    scoreValue: 150,
  },
  tank: {
    maxHealth: 300,
    speed: 1.5,
    damage: 25,
    attackRange: 2.0,
    detectionRange: 15,
    size: [1.5, 2.0, 1.5],
    color: '#4444ff',
    scoreValue: 300,
  },
  sniper: {
    maxHealth: 75,
    speed: 2.0,
    damage: 30,
    attackRange: 15,
    detectionRange: 35,
    size: [0.8, 1.8, 0.8],
    color: '#ff44ff',
    scoreValue: 200,
  },
};

// デフォルトの敵タイプ
export const DEFAULT_ENEMY_TYPE: EnemyType = 'sniper';

// 敵のスポーン設定
export const ENEMY_SPAWN_INTERVAL = 5; // 秒
export const MAX_ENEMIES = 10; // 同時に存在できる最大数
