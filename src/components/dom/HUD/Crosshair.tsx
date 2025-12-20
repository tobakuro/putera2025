import React from 'react';
export default function Crosshair() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
      }}
    >
      <div
        id="placeholder-crosshair"
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          background: 'rgba(0,0,0,0.08)',
          border: '2px solid rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 8, height: 8, background: '#666', borderRadius: 4 }} />
      </div>
    </div>
  );
}
