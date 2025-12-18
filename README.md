This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details


## フォルダ構成
root/
├── .github/workflows/    # CI/CD設定 (自動テスト・Lint)
├── resources/            # 素材原盤(Blender, PSD)、仕様書、メモ。ビルドには含まれない。
├── public/               # 【静的ファイル】アプリで読み込む最適化済みファイル
│   ├── models/           # .glb / .gltf (圧縮済み3Dモデル)
│   ├── sounds/           # .mp3 / .wav (効果音・BGM)
│   └── textures/         # .jpg / .png (テクスチャ画像)
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # ゲームエントリーポイント
│   │   └── layout.tsx    # 全体レイアウト
│   ├── components/       # Reactコンポーネント
│   │   ├── canvas/       # 【3D世界】R3Fコンポーネント (Physics, Mesh)
│   │   │   ├── Player/   # 自機制御、カメラ
│   │   │   ├── Level/    # マップ、壁、床、環境光
│   │   │   ├── Weapon/   # 武器ロジック、エフェクト
│   │   │   ├── Enemy/    # 敵AI、挙動
│   │   │   └── Scene.tsx # これらを統合するメインシーン
│   │   ├── dom/          # 【UI】HTMLコンポーネント (R3Fの外側)
│   │   │   ├── HUD/      # HPバー、残弾、照準、スコア
│   │   │   └── Menu/     # スタート画面、リザルト画面
│   │   └── models/       # 【自動生成】gltfjsxで変換した型付きコンポーネント
│   ├── constants/        # 【定数】ゲームバランス調整用パラメータ
│   │   ├── game.ts       # 重力、制限時間、スコア設定
│   │   ├── player.ts     # 移動速度、ジャンプ力、視点感度
│   │   └── weapons.ts    # 武器の威力、装弾数、リロード時間
│   ├── hooks/            # カスタムフック (ロジック)
│   │   ├── useKeyboard.ts
│   │   └── useRaycast.ts # 射撃判定など
│   ├── stores/           # 状態管理 (Zustand)
│   │   └── useGameStore.ts
│   └── utils/            # 純粋な計算関数
│       └── math.ts       # 3D座標計算など
├── .eslintrc.json
├── package.json
└── README.md 