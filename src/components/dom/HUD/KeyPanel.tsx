import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import useGameStore from '../../../stores/useGameStore';

export default function KeyPanel() {
  const keysCollected = useGameStore((s) => s.keysCollected);
  const totalKeys = useGameStore((s) => s.totalKeys);
  const keyPickupTrigger = useGameStore((s) => s.itemResetTrigger);
  const keyPickupAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play sound when keysCollected increases; itemResetTrigger can signal changes too.
    if (keyPickupAudioRef.current) {
      try {
        keyPickupAudioRef.current.currentTime = 0;
        keyPickupAudioRef.current.play().catch(() => {});
      } catch {
        // ignore play errors
      }
    }
  }, [keysCollected, keyPickupTrigger]);

  return (
    <div style={{ position: 'absolute', right: 16, top: 16 }}>
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '4px solid #777',
          borderRadius: 8,
          padding: 12,
          minWidth: 200,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image src="/textures/2D_UI/鍵＿所持状況確認.png" alt="key" width={18} height={18} />
          <div>
            <div style={{ fontSize: 14 }}>
              鍵: {keysCollected} / {totalKeys}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>目的: ドアを開ける</div>
          </div>
        </div>

        <audio ref={keyPickupAudioRef} src="/sounds/keyget.mp3" />
      </div>
    </div>
  );
}
