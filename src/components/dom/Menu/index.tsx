'use client';

import React from 'react';
import useGameStore from '../../../stores/useGameStore';

export default function Menu() {
  const setGameState = useGameStore((s) => s.setGameState);
  const stageId = useGameStore((s) => s.stageId);
  const setStageId = useGameStore((s) => s.setStageId);
  const resetGame = useGameStore((s) => s.resetGame);

  const onStart = () => {
    // リセットするとstageIdも初期化されるので、選択を維持してからプレイ状態へ
    const chosenStage = stageId;
    resetGame();
    setStageId(chosenStage);
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
      <p style={{ margin: 0 }}>ステージを選んで Start</p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 16,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          minWidth: 320,
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.9 }}>ステージ選択</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setStageId('stage0')}
            style={{
              padding: '10px 14px',
              fontSize: 14,
              borderRadius: 10,
              border:
                stageId === 'stage0' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.25)',
              cursor: 'pointer',
              background: stageId === 'stage0' ? 'rgba(16,185,129,0.25)' : 'rgba(0,0,0,0.15)',
              color: 'white',
            }}
          >
            Stage 0 (既存)
          </button>

          <button
            type="button"
            onClick={() => setStageId('stage1')}
            style={{
              padding: '10px 14px',
              fontSize: 14,
              borderRadius: 10,
              border:
                stageId === 'stage1' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.25)',
              cursor: 'pointer',
              background: stageId === 'stage1' ? 'rgba(16,185,129,0.25)' : 'rgba(0,0,0,0.15)',
              color: 'white',
            }}
          >
            Stage 1 (stage1.glb)
          </button>
        </div>
      </div>
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
