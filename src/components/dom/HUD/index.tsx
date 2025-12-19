import React from 'react';
import useGameStore from '../../../stores/useGameStore';

export default function HUD() {
  const playerHP = useGameStore((s) => s.playerHP);
  const maxHP = useGameStore((s) => s.maxHP);
  const currentAmmo = useGameStore((s) => s.currentAmmo);
  const reserveAmmo = useGameStore((s) => s.reserveAmmo);

  // simple time placeholder (could be wired to store or game timer)
  const timeText = '05:30';

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
            <img
              src="/textures/2D_UI/ライフ＿プレイヤー体力.png"
              alt="life"
              style={{ height: 28, ...imgResponsive }}
            />
            <div>
              <div>
                HP: {['■'.repeat(Math.round((playerHP / maxHP) * 12))]}{' '}
                {Math.round((playerHP / maxHP) * 100)}%
              </div>
              <div style={{ marginTop: 6 }}>
                <img
                  src="/textures/2D_UI/タイム＿ゲームタイム.png"
                  alt="time"
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
              鍵: [{' '}
              <img
                src="/textures/2D_UI/鍵＿所持状況確認.png"
                alt="key"
                style={{ height: 18, verticalAlign: 'middle', ...imgResponsive }}
              />{' '}
              ] (0/1)
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left: Weapon / Ammo */}
      <div style={{ position: 'absolute', left: 16, bottom: 16 }}>
        <div style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/textures/2D_UI/弾丸＿弾数表示.png"
              alt="ammo"
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
        <img
          src="/textures/2D_UI/エイムカーソル＿常に中央表示.png"
          alt="crosshair"
          style={{ height: 32, ...imgResponsive }}
        />
      </div>

      {/* Bottom-right: setting / placeholder rotated tag */}
      <div style={{ position: 'absolute', right: 16, bottom: 24, transform: 'rotate(-20deg)' }}>
        <div style={panelStyle as React.CSSProperties}>
          <img
            src="/textures/2D_UI/設定＿なくてもいい（ゲーム中断）.png"
            alt="settings"
            style={{ height: 36, ...imgResponsive }}
          />
        </div>
      </div>
    </div>
  );
}
