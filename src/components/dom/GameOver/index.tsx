'use client';

import React from 'react';
import useGameStore from '../../../stores/useGameStore';

export default function GameOver() {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.resetGame);
  const score = useGameStore((s) => s.score);

  const onRestart = () => {
    // �X�e�[�W�I�����ێ������܂܃Q�[�������Z�b�g���ĊJ�n
    resetGame(true);
    setGameState('playing');
  };

  const onBackToMenu = () => {
    setGameState('menu');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.9))',
        zIndex: 40,
        color: 'white',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 48, margin: 0 }}>Game Over</h1>
      <p style={{ margin: 0, fontSize: 24 }}>Score: {score}</p>

      <div style={{ display: 'flex', gap: 16 }}>
        <button
          onClick={onRestart}
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
          Restart
        </button>
        <button
          onClick={onBackToMenu}
          style={{
            padding: '12px 24px',
            fontSize: 18,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.5)',
            cursor: 'pointer',
            background: 'transparent',
            color: 'white',
          }}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
