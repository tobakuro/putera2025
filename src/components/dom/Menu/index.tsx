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
      {step === 'title' && <StartScreen onStart={goToStageSelect} />}

      {step === 'stage' && (
        <StageSelect
          localStage={localStage}
          setLocalStage={setLocalStage}
          onNext={goToLevelSelect}
          onBack={goToTitle}
        />
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
