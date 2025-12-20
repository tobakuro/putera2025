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
    // container fills viewport so background can be shown fully; center content
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // remove horizontal padding so background fills edge-to-edge
        padding: '24px 0',
        overflow: 'hidden',
      }}
    >
      {/* Background for the stage select screen */}
      <img
        src="/textures/2D_UI/stage.png"
        alt="stage-select-bg"
        style={{
          position: 'absolute',
          inset: 0,
          // fill the screen to avoid left/right letterbox; crop if necessary
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
          // keep a very light dim so text remains readable but background not too dark
          filter: 'brightness(1) contrast(1.02)',
        }}
      />

      {/* Very subtle overlay for contrast (reduced) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.12))',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content area */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2 style={{ margin: 0, color: 'white', textAlign: 'center', width: '100%' }}>
          ステージ選択
        </h2>

        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Stage 0 - シティ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => setLocalStage('stage0')}
              style={{
                width: 260,
                height: 160,
                padding: 0,
                borderRadius: 10,
                overflow: 'hidden',
                border:
                  localStage === 'stage0'
                    ? '3px solid #10b981'
                    : '2px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <img
                src="/textures/2D_UI/stage0.png"
                alt="stage-city"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </button>
            <div style={{ color: 'white', fontWeight: 700 }}>シティ</div>
          </div>

          {/* Stage 1 - バグ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => setLocalStage('stage1')}
              style={{
                width: 260,
                height: 160,
                padding: 0,
                borderRadius: 10,
                overflow: 'hidden',
                border:
                  localStage === 'stage1'
                    ? '3px solid #10b981'
                    : '2px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <img
                src="/textures/2D_UI/stage1.png"
                alt="stage-bug"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </button>
            <div style={{ color: 'white', fontWeight: 700 }}>バグ</div>
          </div>
        </div>
      </div>

      <button
        aria-label="Back-hit"
        onClick={onBack}
        style={{
          position: 'absolute',
          left: '31%',
          bottom: '8%',
          width: '19%',
          minWidth: 96,
          maxWidth: 240,
          height: '15%',
          minHeight: 48,
          maxHeight: 96,
          background: 'transparent',
          border: 'none',
          zIndex: 3,
          cursor: 'pointer',
        }}
      />

      <button
        aria-label="Next-hit"
        onClick={onNext}
        style={{
          position: 'absolute',
          right: '31%',
          bottom: '8%',
          width: '19%',
          minWidth: 96,
          maxWidth: 240,
          height: '15%',
          minHeight: 48,
          maxHeight: 96,
          background: 'transparent',
          border: 'none',
          zIndex: 3,
          cursor: 'pointer',
        }}
      />
    </div>
  );
}
