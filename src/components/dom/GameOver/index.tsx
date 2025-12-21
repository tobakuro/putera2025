'use client';

import React, { useEffect } from 'react';
import useGameStore from '../../../stores/useGameStore';

export default function GameOver() {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.resetGame);
  const score = useGameStore((s) => s.score);
  const deathReason = useGameStore((s) => s.deathReason);
  const deathKeys = useGameStore((s) => s.deathKeys ?? 0);
  const deathTime = useGameStore((s) => s.deathTime ?? null);
  const isClear = useGameStore((s) => s.isClear ?? false);

  const onRestart = () => {
    resetGame(true);
    setGameState('playing');
  };

  const onBackToMenu = () => {
    setGameState('menu');
  };

  useEffect(() => {
    // GameOver時はポインタロックを解除してカーソルを表示
    try {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    } catch {
      // ignore
    }
  }, []);

  const formatTime = (t: number | null) => {
    if (t == null) return '-';
    // t が秒単位の想定。mm:ss 形式で表示
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const localizeReason = (reason?: string | null) => {
    if (!reason) return '不明';
    // フォーマット: Category:identifier （例: "Enemy:sniper"）
    const parts = reason.split(':');
    if (parts.length < 2) return reason;
    const [cat, id] = parts;
    if (cat === 'Enemy') {
      const map: Record<string, string> = {
        basic: 'バグ',
        fast: 'アサシン',
        tank: 'タンク',
        sniper: 'スナイパー',
      };
      // 接頭辞 "敵:" を表示せず、種類名のみ返す
      return map[id] ?? id;
    }
    // 他カテゴリの簡易翻訳
    if (cat === 'Trap') return `トラップ:${id}`;
    if (cat === 'Fall') return `落下`;
    return reason;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.9))',
        zIndex: 40,
        color: 'white',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 64, margin: 0 }}>{isClear ? 'クリア！' : 'ゲームオーバー'}</h1>
      <div
        style={{
          width: 560,
          maxWidth: '90vw',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'stretch',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>スコア</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{score}</div>
        </div>

        {!isClear && (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ fontSize: 20 }}>死亡原因</div>
            <div style={{ fontSize: 20 }}>{localizeReason(deathReason)}</div>
          </div>
        )}

        {isClear && (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ fontSize: 20 }}>結果</div>
            <div style={{ fontSize: 20 }}>ステージクリア</div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ fontSize: 20 }}>所持鍵数</div>
          <div style={{ fontSize: 20 }}>{deathKeys}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ fontSize: 20 }}>経過時間</div>
          <div style={{ fontSize: 20 }}>{formatTime(deathTime)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <button
          onClick={onRestart}
          style={{
            padding: '14px 28px',
            fontSize: 20,
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            background: '#10b981',
            color: 'white',
          }}
        >
          リトライ
        </button>
        <button
          onClick={onBackToMenu}
          style={{
            padding: '14px 28px',
            fontSize: 20,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.5)',
            cursor: 'pointer',
            background: 'transparent',
            color: 'white',
          }}
        >
          タイトルに戻る
        </button>
      </div>
    </div>
  );
}
