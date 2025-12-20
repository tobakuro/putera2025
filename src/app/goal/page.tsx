import Link from 'next/link';

export default function Page() {
  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        background: '#111',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: 32,
          borderRadius: 8,
          minWidth: 300,
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Goal!</h1>
        <p>ステージクリアしました。</p>
        <div style={{ marginTop: 16 }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#0070f3',
              color: '#fff',
              borderRadius: 6,
              textDecoration: 'none',
            }}
          >
            タイトルへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
