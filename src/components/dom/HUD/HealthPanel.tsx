import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useGameStore from '../../../stores/useGameStore';

export default function HealthPanel() {
  const playerHP = useGameStore((s) => s.playerHP);
  const maxHP = useGameStore((s) => s.maxHP);
  const playerPosition = useGameStore((s) => s.playerPosition);
  const gameState = useGameStore((s) => s.gameState);
  const stageId = useGameStore((s) => s.stageId);

  const [seconds, setSeconds] = useState(0);
  const [timeOffset, setTimeOffset] = useState(0);
  const prevGameStateRef = useRef(gameState);

  useEffect(() => {
    let id: number | undefined;
    const prev = prevGameStateRef.current;
    if (gameState === 'playing') {
      if (prev === 'menu' || prev === 'gameover') setTimeout(() => setSeconds(0), 0);
      id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (gameState === 'menu' || gameState === 'gameover') {
      setTimeout(() => setSeconds(0), 0);
    }
    prevGameStateRef.current = gameState;
    return () => {
      if (id !== undefined) clearInterval(id);
    };
  }, [gameState]);

  useEffect(() => {
    let timeoutId: number | undefined;
    let active = true;
    function scheduleNext() {
      if (!active) return;
      const delay = 5000 + Math.floor(Math.random() * 5001);
      timeoutId = window.setTimeout(() => {
        if (!active) return;
        const offset = Math.random() * 6 - 3;
        setTimeOffset(offset);
        scheduleNext();
      }, delay);
    }
    if (gameState === 'playing') {
      setTimeout(() => setTimeOffset(0), 0);
      scheduleNext();
    } else {
      setTimeout(() => setTimeOffset(0), 0);
    }
    return () => {
      active = false;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [gameState]);

  const displaySeconds = Math.max(0, Math.round(seconds + timeOffset));
  const mm = String(Math.floor(displaySeconds / 60)).padStart(2, '0');
  const ss = String(displaySeconds % 60).padStart(2, '0');
  const timeText = `${mm}:${ss}`;

  const pos = playerPosition ?? { x: 0, y: 0, z: 0 };
  const posText = `${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;

  const hpPercent = maxHP > 0 ? Math.round((playerHP / maxHP) * 100) : 0;
  const hpBlocks = Math.max(0, Math.min(12, Math.round((hpPercent / 100) * 12)));
  const hpBar = '■'.repeat(hpBlocks);

  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.95)',
    border: '4px solid #777',
    borderRadius: 8,
    padding: '8px 12px',
    pointerEvents: 'auto',
    maxWidth: 360,
    boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'absolute', left: 16, top: 16 }}>
      <div style={panelStyle}>
        {gameState === 'playing' && (
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>stage: {stageId}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src="/textures/2D_UI/ライフ＿プレイヤー体力.png"
            alt="life"
            width={28}
            height={28}
            style={{ height: 28, maxWidth: '100%', display: 'block' }}
          />
          <div>
            <div>
              HP: {hpBar} {hpPercent}%
            </div>
            <div style={{ marginTop: 6 }}>
              <Image
                src="/textures/2D_UI/タイム＿ゲームタイム.png"
                alt="time"
                width={18}
                height={18}
                style={{ height: 18, verticalAlign: 'middle', marginRight: 8, maxWidth: '100%' }}
              />
              <span>{timeText}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>座標: ({posText})</div>
          </div>
        </div>
      </div>
    </div>
  );
}
