import React from 'react';
import Image from 'next/image';
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
          <Image
            src="/textures/2D_UI/弾丸＿弾数表示.png"
            alt="ammo"
            width={36}
            height={36}
            style={{ height: 36, maxWidth: '100%', display: 'block' }}
          />
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
