'use client';

import React from 'react';
import useGameStore from '../../../stores/useGameStore';

interface DeathOverlayProps {
  visible: boolean;
}

export default function DeathOverlay({ visible }: DeathOverlayProps) {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleRestart = () => {
    resetGame(true);
    setGameState('playing');
  };

  const handleReturnToMenu = () => {
    resetGame(false);
    setGameState('menu');
  };

  if (!visible) return null;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 30,
  };

  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.95)',
    border: '4px solid #777',
    borderRadius: 8,
    padding: '20px 40px',
    pointerEvents: 'auto',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    maxWidth: '400px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    margin: '8px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const restartButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#2563eb',
    color: 'white',
  };

  const menuButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#6b7280',
    color: 'white',
  };

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <h1
          style={{
            fontSize: '4rem',
            fontWeight: '900',
            color: '#dc2626',
            margin: '0 0 16px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontFamily: 'sans-serif',
          }}
        >
          GAME OVER
        </h1>
        <div
          style={{
            width: '120px',
            height: '4px',
            background: '#dc2626',
            margin: '0 auto 24px auto',
            borderRadius: '2px',
          }}
        ></div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            style={restartButtonStyle}
            onClick={handleRestart}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            RESTART
          </button>
          <button
            style={menuButtonStyle}
            onClick={handleReturnToMenu}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b5563')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6b7280')}
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
