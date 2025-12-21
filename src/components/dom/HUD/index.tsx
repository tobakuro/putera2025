'use client';
import React from 'react';
import HealthPanel from './HealthPanel';
import KeyPanel from './KeyPanel';
import ScorePanel from './ScorePanel';
import AmmoPanel from './AmmoPanel';
import Crosshair from './Crosshair';
import SettingsButton from './SettingsButton';

export default function HUD() {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
    fontFamily: 'sans-serif',
    color: '#111',
    zIndex: 50,
  };

  return (
    <div style={containerStyle}>
      <HealthPanel />
      <KeyPanel />
      <ScorePanel />
      <AmmoPanel />
      <Crosshair />
      <SettingsButton />
    </div>
  );
}
