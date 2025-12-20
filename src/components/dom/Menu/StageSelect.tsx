'use client';

import React from 'react';
import Image from 'next/image';
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
        // ensure full-viewport width to avoid horizontal gaps introduced by parent centering
        width: '100vw',
        left: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Background for the stage select screen */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Image
          src="/textures/2D_UI/stage.png"
          alt="stage-select-bg"
          fill
          priority
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            transform: 'scale(1.06)',
            transformOrigin: 'center',
            filter: 'brightness(1) contrast(1.02)',
          }}
        />
      </div>

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
        {/* 見出しテキストは UI の重複を避けるため非表示にしました */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 260px)',
            gap: 16,
            marginTop: 12,
            alignItems: 'start',
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
                position: 'relative',
                border:
                  localStage === 'stage0'
                    ? '3px solid #10b981'
                    : '2px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <Image
                src="/textures/2D_UI/stage0.png"
                alt="stage-city"
                fill
                style={{ objectFit: 'cover', display: 'block' }}
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
                position: 'relative',
                border:
                  localStage === 'stage1'
                    ? '3px solid #10b981'
                    : '2px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <Image
                src="/textures/2D_UI/stage1.png"
                alt="stage-bug"
                fill
                style={{ objectFit: 'cover', display: 'block' }}
              />
            </button>
            <div style={{ color: 'white', fontWeight: 700 }}>バグ</div>
          </div>

          {/* Stage 2 - 迷路 (ランダム生成、プレビューなし) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => setLocalStage('stage2')}
              style={{
                width: 260,
                height: 160,
                padding: 0,
                borderRadius: 10,
                overflow: 'hidden',
                position: 'relative',
                border:
                  localStage === 'stage2'
                    ? '3px solid #10b981'
                    : '2px solid rgba(255,255,255,0.12)',
                background: 'linear-gradient(180deg, rgba(30,30,30,0.6), rgba(10,10,10,0.6))',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ color: 'white', fontWeight: 700 }}>迷路 (ランダム)</div>
            </button>
            <div style={{ color: 'white', fontWeight: 700 }}>迷路</div>
          </div>
          {/* Stage L - メトロポリス */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => setLocalStage('stageL')}
              style={{
                width: 260,
                height: 160,
                padding: 0,
                borderRadius: 10,
                overflow: 'hidden',
                position: 'relative',
                border:
                  localStage === 'stageL'
                    ? '3px solid #10b981'
                    : '2px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <Image
                src="/textures/2D_UI/metropolis.png"
                alt="stage-metropolis"
                fill
                style={{ objectFit: 'cover', display: 'block' }}
              />
            </button>
            <div style={{ color: 'white', fontWeight: 700 }}>メトロポリス</div>
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
