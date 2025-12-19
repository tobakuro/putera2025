'use client';

import React from 'react';
import Scene from '../components/canvas/Scene';
import Menu from '../components/dom/Menu';
import useGameStore from '../stores/useGameStore';

export default function Page() {
  const gameState = useGameStore((s) => s.gameState);

  // メニュー状態ならメニューを表示。Startで gameState を 'playing' にする。
  if (gameState === 'menu') return <Menu />;

  return <Scene />;
}
