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
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          setKeys((prev) => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
          setKeys((prev) => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
          setKeys((prev) => ({ ...prev, left: true }));
          break;
        case 'KeyD':
          setKeys((prev) => ({ ...prev, right: true }));
          break;
        case 'Space':
          setKeys((prev) => ({ ...prev, jump: true }));
          break;
        case 'KeyR':
          setKeys((prev) => ({ ...prev, reload: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          setKeys((prev) => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
          setKeys((prev) => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
          setKeys((prev) => ({ ...prev, left: false }));
          break;
        case 'KeyD':
          setKeys((prev) => ({ ...prev, right: false }));
          break;
        case 'Space':
          setKeys((prev) => ({ ...prev, jump: false }));
          break;
        case 'KeyR':
          setKeys((prev) => ({ ...prev, reload: false }));
          break;
      }
    };

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
