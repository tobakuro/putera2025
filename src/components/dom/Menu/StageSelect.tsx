'use client';

import React from 'react';
import type { StageId } from '../../../stores/useGameStore';

type Props = {
  localStage: StageId;
  setLocalStage: (s: StageId) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function StageSelect({ localStage, setLocalStage, onNext, onBack }: Props) {
  return (
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

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={onBack} style={{ padding: '8px 12px' }}>
          Back
        </button>
        <button
          onClick={onNext}
          style={{ padding: '8px 12px', background: '#10b981', color: 'white', border: 'none' }}
        >
          Next
        </button>
      </div>
    </>
  );
}
