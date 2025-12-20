'use client';

import React from 'react';

type Props = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: Props) {
  return (
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
    </>
  );
}
