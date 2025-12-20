/* eslint-disable @next/next/no-img-element */
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
      <img
        src="/textures/2D_UI/エイムカーソル＿常に中央表示.png"
        alt="crosshair"
        style={{
          width: 36,
          height: 36,
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
