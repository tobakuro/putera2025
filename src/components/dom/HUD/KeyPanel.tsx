/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef } from 'react';
// Use native img to avoid next/image optimization issues for local UI assets
import useGameStore from '../../../stores/useGameStore';

export default function KeyPanel() {
  const keysCollected = useGameStore((s) => s.keysCollected);
  const totalKeys = useGameStore((s) => s.totalKeys);
  const keyPickupAudioRef = useRef<HTMLAudioElement | null>(null);
  const prevKeysRef = useRef(keysCollected);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const audio = new Audio('/sounds/keyget.mp3');
    audio.volume = 0.35;
    keyPickupAudioRef.current = audio;
    return () => {
      audio.pause();
      keyPickupAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = keyPickupAudioRef.current;
    if (!audio) return;
    if (keysCollected > prevKeysRef.current) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        /* auto-play restrictions */
      });
    }
    prevKeysRef.current = keysCollected;
  }, [keysCollected]);
  const objectiveText = totalKeys > 0 && keysCollected >= totalKeys ? 'ゴールを探せ' : '鍵を探せ';

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
          <img
            src="/textures/2D_UI/鍵＿所持状況確認.png"
            alt="key"
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <div>
            <div style={{ fontSize: 14 }}>
              鍵: {keysCollected} / {totalKeys}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>目的: {objectiveText}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
