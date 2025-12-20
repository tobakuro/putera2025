import React from 'react';
import Image from 'next/image';

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
      <Image
        src="/textures/2D_UI/エイムカーソル＿常に中央表示.png"
        alt="crosshair"
        width={32}
        height={32}
        style={{ height: 32, maxWidth: '100%', display: 'block' }}
      />
    </div>
  );
}
