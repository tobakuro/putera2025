import { useEffect, useState } from 'react';

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
      setKeys((prev) => ({ ...prev, [k]: value }));
    };

    const handleKeyDown = (e: KeyboardEvent) => updateKey(e.code, true);
    const handleKeyUp = (e: KeyboardEvent) => updateKey(e.code, false);

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        // 左クリック
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

  return keys;
}

export default useKeyboard;
