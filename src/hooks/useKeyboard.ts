'use client';

import { useEffect, useState } from 'react';
import useGameStore from '../stores/useGameStore';

export type KeyboardState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  shoot: boolean;
  reload: boolean;
};

export function useKeyboard() {
  const [keys, setKeys] = useState<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    shoot: false,
    reload: false,
  });

  // Subscribe to game state to disable inputs when not in 'playing'
  const gameState = useGameStore((s) => s.gameState);

  useEffect(() => {
    const keyMap: Record<string, keyof KeyboardState> = {
      KeyW: 'forward',
      KeyS: 'backward',
      KeyA: 'left',
      KeyD: 'right',
      Space: 'jump',
      KeyR: 'reload',
    };

    const updateKey = (code: string, value: boolean) => {
      const k = keyMap[code];
      if (!k) return;
      // Ignore movement inputs unless game is playing
      if (useGameStore.getState().gameState !== 'playing') return;
      setKeys((prev) => ({ ...prev, [k]: value }));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape はポインタロック解除時にブラウザ側で先に処理されることがある。
      // ポインタロック中は pointerlockchange 側でポーズを処理するためここでは無視する。
      if (e.code === 'Escape') {
        if (document.pointerLockElement) return;
        const gs = useGameStore.getState().gameState;
        const setState = useGameStore.getState().setGameState;
        if (gs === 'playing') setState('paused');
        else if (gs === 'paused') setState('playing');
        return;
      }
      updateKey(e.code, true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      updateKey(e.code, false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        // 左クリック: only register shooting when playing
        if (useGameStore.getState().gameState !== 'playing') return;
        setKeys((prev) => ({ ...prev, shoot: true }));
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setKeys((prev) => ({ ...prev, shoot: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Clear inputs when not playing
  useEffect(() => {
    let id: number | undefined;
    if (gameState !== 'playing') {
      // Defer setState to avoid synchronous state update inside effect
      id = window.setTimeout(() => {
        setKeys({
          forward: false,
          backward: false,
          left: false,
          right: false,
          jump: false,
          shoot: false,
          reload: false,
        });
      }, 0);
    }
    return () => {
      if (id !== undefined) clearTimeout(id);
    };
  }, [gameState]);

  return keys;
}

export default useKeyboard;
