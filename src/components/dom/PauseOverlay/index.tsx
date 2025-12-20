'use client';

import React from 'react';
import useGameStore from '../../../stores/useGameStore';

export default function PauseOverlay() {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.resetGame);

  const onResume = () => {
    setGameState('playing');
    // note: pointer lock will be requested by clicking on the canvas again
  };

  const onReturnToStart = () => {
    // Reset full game state and return to menu
    resetGame(false);
    setGameState('menu');
  };

  const requestRespawn = useGameStore((s) => s.requestRespawn);

  const onRespawn = () => {
    // リスポーンを要求してゲームを再開する
    requestRespawn();
    setGameState('playing');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        zIndex: 60,
        color: 'white',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 36 }}>一時停止</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onResume}
          style={{ padding: '10px 16px', fontSize: 16, borderRadius: 8, cursor: 'pointer' }}
        >
          再開
        </button>
        <button
          onClick={onRespawn}
          style={{ padding: '10px 16px', fontSize: 16, borderRadius: 8, cursor: 'pointer' }}
        >
          リスポーン
        </button>
        <button
          onClick={onReturnToStart}
          style={{ padding: '10px 16px', fontSize: 16, borderRadius: 8, cursor: 'pointer' }}
        >
          スタート画面に戻る
        </button>
      </div>
      <div style={{ marginTop: 8, opacity: 0.9, fontSize: 12 }}>Escキーで再開</div>
    </div>
  );
}
