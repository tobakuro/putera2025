'use client';

import React from 'react';

type Props = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Background image only (visible) */}
      <img
        src="/textures/2D_UI/サムネイル.png"
        alt="thumbnail"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // brighten image so the screen is not too dark
          filter: 'brightness(0.9) contrast(1.05) saturate(1.05)',
        }}
      />

      {/* Clickable invisible overlay button that covers the full screen */}
      <button
        onClick={onStart}
        aria-label="Start"
        title="Start"
        style={{
          position: 'absolute',
          // center lower than middle (moved further down)
          left: '50%',
          top: '80%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          width: '10%',
          maxWidth: 720,
          minWidth: 240,
          height: 120,
          background: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          // keep visually invisible but keyboard-focusable
          color: 'transparent',
        }}
      />

      {/* subtle vignette for mood (non-interactive) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          // soften vignette so the image appears brighter overall
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.25) 100%)',
        }}
      />
    </div>
  );
}
