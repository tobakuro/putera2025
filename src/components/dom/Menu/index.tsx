'use client';

import React, { useState } from 'react';
import useGameStore from '../../../stores/useGameStore';

export default function Menu() {
  const setGameState = useGameStore((s) => s.setGameState);
  const stageId = useGameStore((s) => s.stageId);
  const setStageId = useGameStore((s) => s.setStageId);
  const resetGame = useGameStore((s) => s.resetGame);
  const setLevel = useGameStore((s) => s.setLevel);

  const [step, setStep] = useState<'title' | 'stage' | 'level'>('title');
  const [localStage, setLocalStage] = useState(stageId);

  const goToStageSelect = () => setStep('stage');
  const goToTitle = () => setStep('title');
  const goToLevelSelect = () => setStep('level');

  const onStartGame = () => {
    // 選択ステージを反映してゲーム開始
    setStageId(localStage);
    resetGame(true);
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
      {step === 'title' && (
        <>
          <h1 style={{ fontSize: 48, margin: 0 }}>Putera2025</h1>
          <p style={{ margin: 0 }}>ようこそ — Start を押して進んでください</p>
          <div style={{ marginTop: 20 }}>
            <button
              onClick={goToStageSelect}
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
        </>
      )}

      {step === 'stage' && (
        <>
          <h2 style={{ margin: 0 }}>ステージ選択</h2>
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 12,
              padding: 16,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              minWidth: 320,
            }}
          >
            <button
              type="button"
              onClick={() => setLocalStage('stage0')}
              style={{
                padding: '10px 14px',
                fontSize: 14,
                borderRadius: 10,
                border:
                  localStage === 'stage0'
                    ? '2px solid #10b981'
                    : '1px solid rgba(255,255,255,0.25)',
                cursor: 'pointer',
                background: localStage === 'stage0' ? 'rgba(16,185,129,0.25)' : 'rgba(0,0,0,0.15)',
                color: 'white',
              }}
            >
              Stage 0
            </button>

            <button
              type="button"
              onClick={() => setLocalStage('stage1')}
              style={{
                padding: '10px 14px',
                fontSize: 14,
                borderRadius: 10,
                border:
                  localStage === 'stage1'
                    ? '2px solid #10b981'
                    : '1px solid rgba(255,255,255,0.25)',
                cursor: 'pointer',
                background: localStage === 'stage1' ? 'rgba(16,185,129,0.25)' : 'rgba(0,0,0,0.15)',
                color: 'white',
              }}
            >
              Stage 1
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={goToTitle} style={{ padding: '8px 12px' }}>
              Back
            </button>
            <button
              onClick={goToLevelSelect}
              style={{ padding: '8px 12px', background: '#10b981', color: 'white', border: 'none' }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 'level' && (
        <>
          <h2 style={{ margin: 0 }}>レベル選択 — {localStage}</h2>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[1, 2, 3, 4].map((lv) => (
              <button
                key={lv}
                onClick={() => {
                  setLevel(lv);
                  onStartGame();
                }}
                style={{ padding: '10px 14px', borderRadius: 8 }}
              >
                Level {lv}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => setStep('stage')} style={{ padding: '8px 12px' }}>
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}
