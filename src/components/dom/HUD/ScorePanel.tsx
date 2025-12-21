import React from 'react';
import useGameStore from '../../../stores/useGameStore';

export default function ScorePanel() {
  const enemyKillCount = useGameStore((s) => s.enemyKillCount || 0);
  const score = useGameStore((s) => s.score);

  return (
    <div style={{ position: 'absolute', right: 16, top: 92 }}>
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '4px solid #777',
          borderRadius: 8,
          padding: 12,
          minWidth: 200,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 14 }}>撃破数: {enemyKillCount}</div>
          <div style={{ fontSize: 14 }}>スコア: {score}</div>
        </div>
      </div>
    </div>
  );
}
