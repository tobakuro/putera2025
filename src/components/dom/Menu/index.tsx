'use client';

import React, { useState } from 'react';
import useGameStore from '../../../stores/useGameStore';
import StartScreen from './StartScreen';
import StageSelect from './StageSelect';

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
          <div
            id="placeholder-logo"
            style={{
              width: 420,
              height: 140,
              background: '#e0e0e0',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Logo Placeholder
          </div>
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
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div
              id="placeholder-stage-stage0"
              style={{
                width: 220,
                height: 140,
                background: '#e7e7e7',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#444',
              }}
            >
              Stage0 Preview
            </div>
            <div
              id="placeholder-stage-stage1"
              style={{
                width: 220,
                height: 140,
                background: '#e7e7e7',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#444',
              }}
            >
              Stage1 Preview
            </div>
          </div>
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
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            {[1, 2, 3, 4].map((lv) => (
              <div
                key={lv}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <button
                  data-level={lv}
                  onClick={() => {
                    setLevel(lv);
                    onStartGame();
                  }}
                  style={{
                    width: 120,
                    height: 80,
                    borderRadius: 8,
                    background: '#eaeaea',
                    border: '1px dashed #ccc',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ color: '#333', fontWeight: 600 }}>Level {lv}</div>
                </button>
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>Preview Tile</div>
              </div>
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
