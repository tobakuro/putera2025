import React from 'react';
// Use native img for HUD icons
import useGameStore from '../../../stores/useGameStore';

export default function AmmoPanel() {
  const currentAmmo = useGameStore((s) => s.currentAmmo);
  const reserveAmmo = useGameStore((s) => s.reserveAmmo);

  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.95)',
    border: '4px solid #777',
    borderRadius: 8,
    padding: 8,
    pointerEvents: 'auto',
    maxWidth: 360,
    boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'absolute', left: 16, bottom: 16 }}>
      <div style={panelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            id="placeholder-ammo-icon"
            style={{
              width: 40,
              height: 40,
              background: '#efefef',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
            }}
          >
            Ammo
          </div>
          <div>
            <div>装備済みの銃アイコン</div>
            <div style={{ marginTop: 6 }}>
              装弾数: {currentAmmo} / {reserveAmmo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
