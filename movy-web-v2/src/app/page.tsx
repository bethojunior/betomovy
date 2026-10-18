import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#070A1A', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '54px', fontWeight: '900', color: '#04F3FA', letterSpacing: '2px', margin: 0 }}>
          MOVY
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '16px', letterSpacing: '3px', fontWeight: '700', marginTop: '4px', marginBottom: '32px' }}>
          GLOBAL MOBILITY & FLEET PLATFORM
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
          <Link
            href="/monitor"
            style={{ backgroundColor: '#0F1426', border: '1px solid #00349A', borderRadius: '14px', padding: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.2s' }}
          >
            <span style={{ fontSize: '32px', marginBottom: '10px' }}>📊</span>
            <span style={{ color: '#04F3FA', fontWeight: '800', fontSize: '18px' }}>Monitor de Frotas</span>
            <span style={{ color: '#94A3B8', fontSize: '12px', marginTop: '6px' }}>Gestão ao Vivo & Chaves Globais</span>
          </Link>

          <Link
            href="/central"
            style={{ backgroundColor: '#0F1426', border: '1px solid #00349A', borderRadius: '14px', padding: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.2s' }}
          >
            <span style={{ fontSize: '32px', marginBottom: '10px' }}>📞</span>
            <span style={{ color: '#10B981', fontWeight: '800', fontSize: '18px' }}>Central de Despacho</span>
            <span style={{ color: '#94A3B8', fontSize: '12px', marginTop: '6px' }}>Atendimento Telefônico & WhatsApp</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
