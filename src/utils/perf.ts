export type PerfLabel =
  | 'EnemyManager.playerPos'
  | 'Player.groundRay'
  | 'Enemy.ai'
  | 'Weapon.bullets'
  | 'Frame'
  | string;

const isEnabled = () => {
  if (typeof window === 'undefined') return false;
  // URLに ?perf=1 を付けたときだけ有効
  try {
    return new URLSearchParams(window.location.search).get('perf') === '1';
  } catch {
    return false;
  }
};

// 低コストにするため、enabled時のみ map を使う
const stats = new Map<string, { n: number; total: number; max: number }>();

export function perfNow() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

export function perfStart(label: PerfLabel) {
  if (!isEnabled()) return null;
  return { label, t0: perfNow() };
}

export function perfEnd(token: { label: string; t0: number } | null) {
  if (!token) return;
  const dt = perfNow() - token.t0;
  const cur = stats.get(token.label) ?? { n: 0, total: 0, max: 0 };
  cur.n += 1;
  cur.total += dt;
  cur.max = Math.max(cur.max, dt);
  stats.set(token.label, cur);
}

export function perfFlushEvery(seconds = 2) {
  if (!isEnabled()) return () => {};
  let last = perfNow();
  return () => {
    const now = perfNow();
    if ((now - last) / 1000 < seconds) return;
    last = now;
    console.groupCollapsed('[perf]');
    for (const [k, v] of stats.entries()) {
      const avg = v.total / Math.max(1, v.n);
      console.log(`${k}: avg ${avg.toFixed(3)} ms, max ${v.max.toFixed(3)} ms, n=${v.n}`);
    }
    console.groupEnd();
    stats.clear();
  };
}
