## 使用している主な技術

## プロジェクトの概要

## 必要な環境変数やコマンド一覧

## ディレクトリ構成

root/
├── .github/workflows/ # CI/CD設定 (自動テスト・Lint)
├── resources/ # 素材原盤(Blender, PSD)、仕様書、メモ。ビルドには含まれない。
├── public/ # 【静的ファイル】アプリで読み込む最適化済みファイル
│ ├── models/ # .glb / .gltf (圧縮済み3Dモデル)
│ ├── sounds/ # .mp3 / .wav (効果音・BGM)
│ └── textures/ # .jpg / .png (テクスチャ画像)
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── page.tsx # ゲームエントリーポイント
│ │ └── layout.tsx # 全体レイアウト
│ ├── components/ # Reactコンポーネント
│ │ ├── characters/ # キャラ用フォルダ
│ │ ├── levels/ # ステージ・背景用フォルダ
│ │ └── weapons/ # 武器用
│ │ ├── canvas/ # 【3D世界】R3Fコンポーネント (Physics, Mesh)
│ │ │ ├── Player/ # 自機制御、カメラ
│ │ │ ├── Level/ # マップ、壁、床、環境光
│ │ │ ├── Weapon/ # 武器ロジック、エフェクト
│ │ │ ├── Enemy/ # 敵AI、挙動
│ │ │ └── Scene.tsx # これらを統合するメインシーン
│ │ ├── dom/ # 【UI】HTMLコンポーネント (R3Fの外側)
│ │ │ ├── HUD/ # HPバー、残弾、照準、スコア
│ │ │ └── Menu/ # スタート画面、リザルト画面
│ │ └── models/ # 【自動生成】gltfjsxで変換した型付きコンポーネント
│ ├── constants/ # 【定数】ゲームバランス調整用パラメータ
│ │ ├── game.ts # 重力、制限時間、スコア設定
│ │ ├── player.ts # 移動速度、ジャンプ力、視点感度
│ │ └── weapons.ts # 武器の威力、装弾数、リロード時間
│ ├── hooks/ # カスタムフック (ロジック)
│ │ ├── useKeyboard.ts
│ │ └── useRaycast.ts # 射撃判定など
│ ├── stores/ # 状態管理 (Zustand)
│ │ └── useGameStore.ts
│ └── utils/ # 純粋な計算関数
│ └── math.ts # 3D座標計算など
├── .eslintrc.json
├── package.json
└── README.md

## 開発環境の構築方法

## トラブルシューティング
