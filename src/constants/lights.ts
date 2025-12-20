// Scene で使うライト設定。調整しやすいよう中央管理しています。
export const AMBIENT_INTENSITY = 0.7;

export const DIRECTIONAL_LIGHT = {
  position: [20, 40, 10] as [number, number, number],
  intensity: 1.2,
  // シャドウマップの解像度（幅／高さ）
  shadowMapSize: 2048,
  // シャドウ用カメラのフラustum（影の有効範囲）
  shadowCamera: {
    near: 0.5,
    far: 300,
    left: -80,
    right: 80,
    top: 80,
    bottom: -80,
  },
  // シャドウのバイアス（影のアーティファクト緩和）
  shadowBias: -0.0005,
  // シャドウのぼかし量（soft shadows）
  shadowRadius: 2,
  // 影の最大暗さのキャップ (0..1). 1 = そのまま、0.5 = 最大暗さを半分に抑える
  shadowDarknessCap: 0.8,
} as const;

export const HEMISPHERE_LIGHT = {
  skyColor: '#ffffff',
  groundColor: '#444444',
  intensity: 0.25,
} as const;

export const CONTACT_SHADOWS = {
  position: [0, 0.01, 0] as [number, number, number],
  opacity: 0.6,
  width: 20,
  height: 20,
  blur: 1.5,
  far: 10,
} as const;
