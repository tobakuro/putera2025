'use client';

import React from 'react';
import Scene from '../components/canvas/Scene';
import Menu from '../components/dom/Menu';
import GameOver from '../components/dom/GameOver';
import HUD from '../components/dom/HUD';
import PauseOverlay from '../components/dom/PauseOverlay';
import useGameStore from '../stores/useGameStore';

export default function Page() {
  const gameState = useGameStore((s) => s.gameState);

  // メニュー状態ならメニューを表示。Startで gameState を 'playing' にする。
  if (gameState === 'menu') return <Menu />;

  // ゲームオーバー状態なら GameOver オーバーレイを表示
  if (gameState === 'gameover')
    return (
      <>
        <Scene />
        <GameOver />
      </>
    );

  return (
    <>
      <Scene />
      <HUD />
      {gameState === 'paused' && <PauseOverlay />}
    </>
  );
}
