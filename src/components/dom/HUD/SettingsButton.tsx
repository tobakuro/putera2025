import React from 'react';
import Image from 'next/image';

export default function SettingsButton() {
  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.95)',
    border: '4px solid #777',
    borderRadius: 8,
    padding: 8,
    pointerEvents: 'auto',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'absolute', right: 16, bottom: 24, transform: 'rotate(-20deg)' }}>
      <div style={panelStyle}>
        <button
          type="button"
          aria-label="Open settings"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src="/textures/2D_UI/設定＿なくてもいい（ゲーム中断）.png"
            alt="settings"
            width={36}
            height={36}
            style={{ height: 36, maxWidth: '100%', display: 'block' }}
          />
        </button>
      </div>
    </div>
  );
}
