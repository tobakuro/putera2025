import React from 'react';
// Use native img for HUD icons

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
          <div
            id="placeholder-settings-icon"
            style={{
              width: 40,
              height: 40,
              background: '#ececec',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
            }}
          >
            Set
          </div>
        </button>
      </div>
    </div>
  );
}
