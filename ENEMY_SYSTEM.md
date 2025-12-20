# 敵システム実装ドキュメント

## 概要

3Dシューティングゲームに汎用性のある敵システムを実装しました。敵の種類を簡単に追加できる設計になっています。

**🎨 3Dモデル対応**: 敵はプレイヤーと同じhitogataモデルを使用し、色を変えることで区別しています。移動アニメーション付き！

## 実装されたファイル

### 1. 定数ファイル

- **`src/constants/enemies.ts`** - 敵の型定義とステータス設定
  - 4種類の敵タイプ（basic, fast, tank, sniper）のステータスを定義
  - 各敵の体力、速度、ダメージ、攻撃範囲、検知範囲、サイズ、色、スコア値を設定

### 2. ストア拡張

- **`src/stores/useGameStore.ts`** - 敵の状態管理を追加
  - `enemies: Enemy[]` - 現在のフィールド上の敵リスト
  - `addEnemy()` - 敵を追加
  - `removeEnemy()` - 敵を削除
  - `updateEnemyHealth()` - 敵のHPを更新
  - `updateEnemyPosition()` - 敵の位置を更新
  - `clearEnemies()` - 全敵をクリア

### 3. モデルコンポーネント

- **`src/components/models/characters/EnemyModel.tsx`** - 敵用3Dモデル
  - プレイヤーと同じhitogataモデルを使用
  - 色をカスタマイズ可能
  - 移動時の歩行アニメーション対応

### 4. 敵システムコンポーネント

- **`src/components/canvas/Enemy/Enemy.tsx`** - 個別の敵コンポーネント
  - 3Dモデルの表示（色変更対応）
  - プレイヤー追跡AI
  - 攻撃ロジック（1秒ごとにダメージ）
  - HPバー表示
  - 物理演算との統合
  - 移動アニメーション制御

- **`src/components/canvas/Enemy/EnemySpawner.tsx`** - 敵スポーンシステム
  - ゲーム開始時に初期敵（2体）をスポーン
  - 5秒間隔で自動スポーン（最大10体まで）
  - ステージごとのスポーン位置管理

- **`src/components/canvas/Enemy/EnemyManager.tsx`** - 敵システム管理
  - プレイヤー位置の追跡
  - EnemySpawnerとの統合

### 5. 既存ファイルの修正

- **`src/components/canvas/Weapon/Weapon.tsx`**
  - 弾丸と敵の衝突判定を実装
  - 敵にダメージを与える処理
  - 敵撃破時のスコア加算

- **`src/components/canvas/Scene.tsx`**
  - EnemyManagerを追加

- **`src/components/canvas/Player/index.tsx`**
  - userDataにisPlayerフラグを追加（敵AIがプレイヤーを認識するため）

- **`src/constants/stages.ts`**
  - 各ステージの敵スポーン位置を定義

## 敵のステータス設定

### Basic（基本型）

- 体力: 100
- 速度: 3.0 m/s
- ダメージ: 10
- 攻撃範囲: 1.5m
- 検知範囲: 20m
- 色: 赤（#ff4444）
- スコア: 100

### Fast（高速型）

- 体力: 50
- 速度: 6.0 m/s
- ダメージ: 5
- 攻撃範囲: 1.0m
- 検知範囲: 25m
- 色: 緑（#44ff44）
- スコア: 150

### Tank（重装型）

- 体力: 300
- 速度: 1.5 m/s
- ダメージ: 25
- 攻撃範囲: 2.0m
- 検知範囲: 15m
- 色: 青（#4444ff）
- スコア: 300

### Sniper（狙撃型）

- 体力: 75
- 速度: 2.0 m/s
- ダメージ: 30
- 攻撃範囲: 15m
- 検知範囲: 35m
- 色: 紫（#ff44ff）
- スコア: 200

## 使用方法

### 新しい敵タイプを追加する

1. **`src/constants/enemies.ts`** を編集:

```typescript
export type EnemyType = 'basic' | 'fast' | 'tank' | 'sniper' | 'newType';

export const ENEMY_STATS: Record<EnemyType, EnemyStats> = {
  // 既存の敵...
  newType: {
    maxHealth: 150,
    speed: 4.0,
    damage: 15,
    attackRange: 2.0,
    detectionRange: 30,
    size: [1.2, 1.8, 1.2],
    color: '#ffaa00',
    scoreValue: 250,
  },
};
```

2. **`src/components/canvas/Enemy/EnemySpawner.tsx`** でスポーンロジックを調整:

```typescript
// ランダムに敵タイプを選択する例
const enemyTypes: EnemyType[] = ['basic', 'fast', 'tank', 'newType'];
const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
```

### スポーン設定の調整

**`src/constants/enemies.ts`** で定数を変更:

```typescript
export const ENEMY_SPAWN_INTERVAL = 5; // スポーン間隔（秒）
export const MAX_ENEMIES = 10; // 最大同時出現数
```

### ステージごとのスポーン位置を追加

**`src/constants/stages.ts`** を編集:

```typescript
export const ENEMY_SPAWN_POINTS: Record<StageId, [number, number, number][]> = {
  stage0: [
    [10, 2, 10],
    // ... 他のスポーン位置
  ],
  newStage: [
    [5, 3, 5],
    // 新しいステージのスポーン位置
  ],
};
```

## 主な機能

### 敵AI

- プレイヤーを検知範囲内で追跡
- 攻撃範囲内でダメージを与える
- プレイヤーの方向を向く
- 物理演算による自然な動き

### ビジュアル

- 敵タイプごとに異なる色
- HPバーの表示（緑→赤）
- 影の描画

### ゲームプレイ

- 弾丸による敵へのダメージ
- 敵撃破時のスコア加算
- 敵からプレイヤーへのダメージ（1秒ごと）
- 自動スポーンシステム

## 今後の拡張案

1. **敵のバリエーション**
   - 遠距離攻撃する敵
   - 飛行する敵
   - ボス敵

2. **スポーンシステムの改善**
   - ウェーブシステム
   - 難易度による調整
   - スポーン位置の動的生成

3. **ビジュアルの強化**
   - 3Dモデルの使用
   - アニメーション
   - エフェクト（死亡時など）

4. **AI の改善**
   - パスファインディング（障害物回避）
   - より複雑な行動パターン
   - 集団行動

## トラブルシューティング

### 敵が表示されない

- ゲームが'playing'状態になっているか確認
- ブラウザのコンソールでエラーをチェック
- スポーン位置がステージ内に収まっているか確認

### 衝突判定が動作しない

- Weaponコンポーネントが正しくインポートされているか確認
- 敵のuserDataが正しく設定されているか確認

### パフォーマンスの問題

- MAX_ENEMIESの値を減らす
- ENEMY_SPAWN_INTERVALを増やす
