'use client';

import React from 'react';
import Scene from '../components/canvas/Scene';
import Menu from '../components/dom/Menu';
import HUD from '../components/dom/HUD';
import PauseOverlay from '../components/dom/PauseOverlay';
import GameOver from '../components/dom/GameOver';
import DeathOverlay from '../components/dom/DeathOverlay';
import useGameStore from '../stores/useGameStore';

export default function Page() {
  const gameState = useGameStore((s) => s.gameState);
  const isDead = useGameStore((s) => s.isDead);

  // メニュー状態ならメニューを表示。Startで gameState を 'playing' にする。
  if (gameState === 'menu') return <Menu />;

  return (
    <>
      <Scene />
      <HUD />
      {gameState === 'paused' && <PauseOverlay />}
      {gameState === 'gameover' && <GameOver />}
      {isDead && gameState === 'playing' && <DeathOverlay visible={true} />}
    </>
  );
}
