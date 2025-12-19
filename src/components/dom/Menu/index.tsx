'use client';

import React from 'react';
import useGameStore from '../../../stores/useGameStore';

export default function Menu() {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.resetGame);

  const onStart = () => {
    // リセットしてからプレイ状態へ
    resetGame();
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
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
        zIndex: 40,
        color: 'white',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 48, margin: 0 }}>Putera2025</h1>
      <p style={{ margin: 0 }}>Press Start to begin</p>
      <div style={{ marginTop: 20 }}>
        <button
          onClick={onStart}
          style={{
            padding: '12px 24px',
            fontSize: 18,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            background: '#10b981',
            color: 'white',
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
}
