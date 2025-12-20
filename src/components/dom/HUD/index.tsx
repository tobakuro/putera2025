'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useGameStore from '../../../stores/useGameStore';

export default function HUD() {
  const playerHP = useGameStore((s) => s.playerHP);
  const maxHP = useGameStore((s) => s.maxHP);
  const currentAmmo = useGameStore((s) => s.currentAmmo);
  const reserveAmmo = useGameStore((s) => s.reserveAmmo);
  const keysCollected = useGameStore((s) => s.keysCollected);
  const totalKeys = useGameStore((s) => s.totalKeys);

  // simple time placeholder (could be wired to store or game timer)
  const gameState = useGameStore((s) => s.gameState);
  const [seconds, setSeconds] = useState(0);

  // start/stop timer when gameState becomes 'playing'
  useEffect(() => {
    let id: number | undefined;
    if (gameState === 'playing') {
      // reset timer on new play session (defer to avoid synchronous setState in effect)
      setTimeout(() => setSeconds(0), 0);
      id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      // ensure timer is reset when not playing
      setTimeout(() => setSeconds(0), 0);
    }
    return () => {
      if (id !== undefined) clearInterval(id);
    };
  }, [gameState]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const timeText = `${mm}:${ss}`;

  // Safe HP calculations: guard against division by zero and invalid values
  const hpPercent = maxHP > 0 ? Math.round((playerHP / maxHP) * 100) : 0;
  const hpBlocks = Math.max(0, Math.min(12, Math.round((hpPercent / 100) * 12)));
  const hpBar = '■'.repeat(hpBlocks);

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

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
    fontFamily: 'sans-serif',
    color: '#111',
    zIndex: 50,
  };

  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.95)',
    border: '4px solid #777',
    borderRadius: 8,
    padding: '8px 12px',
    pointerEvents: 'auto',
    maxWidth: 360,
    boxSizing: 'border-box',
  };

  const imgResponsive: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
  };

  return (
    <div style={containerStyle}>
      {/* Top-left: HP + Time */}
      <div style={{ position: 'absolute', left: 16, top: 16 }}>
        <div style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image
              src="/textures/2D_UI/ライフ＿プレイヤー体力.png"
              alt="life"
              width={28}
              height={28}
              style={{ height: 28, ...imgResponsive }}
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
                  style={{ height: 18, verticalAlign: 'middle', marginRight: 8, ...imgResponsive }}
                />
                <span>{timeText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top-right: Objective / Keys */}
      <div style={{ position: 'absolute', right: 16, top: 16 }}>
        <div style={panelStyle}>
          <div style={{ textAlign: 'center' }}>
            <div>現在の目標: カギを集めろ</div>
            <div style={{ marginTop: 6 }}>
              鍵: [
              <Image
                src="/textures/2D_UI/鍵＿所持状況確認.png"
                alt="key"
                width={18}
                height={18}
                style={{
                  height: 18,
                  verticalAlign: 'middle',
                  marginLeft: 6,
                  marginRight: 6,
                  display: 'inline-block',
                }}
              />
              ] ({keysCollected}/{totalKeys})
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left: Weapon / Ammo */}
      <div style={{ position: 'absolute', left: 16, bottom: 16 }}>
        <div style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image
              src="/textures/2D_UI/弾丸＿弾数表示.png"
              alt="ammo"
              width={36}
              height={36}
              style={{ height: 36, ...imgResponsive }}
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

      {/* Center crosshair */}
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
          style={{ height: 32, ...imgResponsive }}
        />
      </div>

      {/* Bottom-right: setting / placeholder rotated tag */}
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
              style={{ height: 36, ...imgResponsive }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
