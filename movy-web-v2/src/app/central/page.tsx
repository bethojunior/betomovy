'use client';

import React, { useState } from 'react';

export default function CentralDispatchPage() {
  const [country, setCountry] = useState<'US' | 'BR'>('US');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [fareEstimate, setFareEstimate] = useState(country === 'US' ? 18.50 : 32.00);
  const [lastDispatchedTrip, setLastDispatchedTrip] = useState<any>(null);

  const handlePhoneLookup = (phone: string) => {
    setCustomerPhone(phone);
    // Simulação do preenchimento instantâneo histórico do passageiro habitual
    if (phone.length >= 8) {
      if (country === 'US') {
        setCustomerName('Robert Davis');
        setOriginAddress('800 Brickell Ave, Miami, FL');
        setDestinationAddress('Miami International Airport (MIA)');
        setFareEstimate(24.50);
      } else {
        setCustomerName('Maria Oliveira');
        setOriginAddress('Av. Paulista, 1000 - Bela Vista');
        setDestinationAddress('Aeroporto de Congonhas (CGH)');
        setFareEstimate(38.00);
      }
    }
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const tripId = 'DISP-' + Math.floor(100000 + Math.random() * 900000);
    const trackingLink = `https://movymob.com/track/${tripId}`;

    const dispatched = {
      tripId,
      customerName,
      customerPhone,
      origin: originAddress,
      destination: destinationAddress,
      fare: fareEstimate,
      currency: country === 'US' ? '$ USD' : 'R$ BRL',
      driverAssigned: 'Carlos Mendez (Toyota Camry 2024)',
      trackingLink,
      whatsappMessage: country === 'US'
        ? `Hello ${customerName}! Your MOVY ride is confirmed. Driver Carlos (Camry) is en route. Live track: ${trackingLink}`
        : `Olá ${customerName}! Seu MOVY foi confirmado. Motorista Carlos (Camry) está a caminho. Rastreie ao vivo: ${trackingLink}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLastDispatchedTrip(dispatched);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070A1A', color: '#FFF', fontFamily: 'sans-serif', padding: '32px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: '20px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#04F3FA', letterSpacing: '1px', margin: 0 }}>
            MOVY CENTRAL DE DESPACHO (ATENDIMENTO RÁPIDO)
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Lançamento ultrarrápido de corridas telefônicas com robô de WhatsApp integrado
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { setCountry('US'); setFareEstimate(24.50); }}
            style={{ backgroundColor: country === 'US' ? '#00349A' : '#171D36', color: '#FFF', border: '1px solid #00349A', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
          >
            🇺🇸 Modo Estados Unidos ($ USD)
          </button>
          <button
            onClick={() => { setCountry('BR'); setFareEstimate(38.00); }}
            style={{ backgroundColor: country === 'BR' ? '#00349A' : '#171D36', color: '#FFF', border: '1px solid #00349A', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
          >
            🇧🇷 Modo Brasil (R$ BRL)
          </button>
          <a
            href="/monitor"
            style={{ backgroundColor: '#171D36', color: '#04F3FA', border: '1px solid #04F3FA', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}
          >
            Abrir Monitor de Frotas
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
        {/* Formulário de Atendimento e Despacho em < 8 segundos */}
        <div style={{ backgroundColor: '#0F1426', padding: '24px', borderRadius: '14px', border: '1px solid #1E293B' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#FFF', margin: '0 0 16px 0' }}>
            ⚡ Criar Corrida por Telefone / Atendimento
          </h2>

          <form onSubmit={handleDispatch}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                {country === 'US' ? 'CUSTOMER PHONE (+1)' : 'TELEFONE DO CLIENTE (+55)'} (Busca Rápida)
              </label>
              <input
                type="text"
                placeholder={country === 'US' ? '+1 (305) 555-0199' : '(11) 98765-4321'}
                value={customerPhone}
                onChange={(e) => handlePhoneLookup(e.target.value)}
                style={{ width: '100%', backgroundColor: '#171D36', border: '1px solid #1E293B', color: '#FFF', padding: '12px', borderRadius: '8px', fontSize: '15px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                NOME DO PASSAGEIRO
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nome do cliente"
                style={{ width: '100%', backgroundColor: '#171D36', border: '1px solid #1E293B', color: '#FFF', padding: '12px', borderRadius: '8px', fontSize: '15px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                ENDEREÇO DE EMBARQUE (ORIGEM)
              </label>
              <input
                type="text"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                placeholder="Rua, número e ponto de referência"
                style={{ width: '100%', backgroundColor: '#171D36', border: '1px solid #1E293B', color: '#FFF', padding: '12px', borderRadius: '8px', fontSize: '15px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                DESTINO FINAL
              </label>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="Destino do passageiro"
                style={{ width: '100%', backgroundColor: '#171D36', border: '1px solid #1E293B', color: '#FFF', padding: '12px', borderRadius: '8px', fontSize: '15px' }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#171D36', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
              <div>
                <span style={{ color: '#94A3B8', fontSize: '12px' }}>VALOR ESTIMADO: </span>
                <span style={{ color: '#04F3FA', fontSize: '20px', fontWeight: '900' }}>
                  {country === 'US' ? `$ ${fareEstimate.toFixed(2)}` : `R$ ${fareEstimate.toFixed(2)}`}
                </span>
              </div>
              <span style={{ color: '#10B981', fontSize: '12px', fontWeight: '700' }}>Despacho Imediato</span>
            </div>

            <button
              type="submit"
              style={{ width: '100%', backgroundColor: '#04F3FA', color: '#070A1A', border: 'none', padding: '16px', borderRadius: '8px', fontSize: '16px', fontWeight: '900', cursor: 'pointer', letterSpacing: '0.5px' }}
            >
              🚀 DESPACHAR CORRIDA AGORA (< 8 SEG)
            </button>
          </form>
        </div>

        {/* Resumo do Último Despacho & Robô de WhatsApp */}
        <div style={{ backgroundColor: '#0F1426', padding: '24px', borderRadius: '14px', border: '1px solid #1E293B' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#10B981', margin: '0 0 16px 0' }}>
            📱 Notificação Automática por WhatsApp / SMS
          </h2>

          {lastDispatchedTrip ? (
            <div>
              <div style={{ backgroundColor: '#171D36', padding: '16px', borderRadius: '10px', marginBottom: '16px', borderLeft: '4px solid #10B981' }}>
                <div style={{ color: '#10B981', fontWeight: '800', fontSize: '13px' }}>STATUS: CORRIDA DESPACHADA ({lastDispatchedTrip.tripId})</div>
                <div style={{ color: '#FFF', fontSize: '16px', fontWeight: '700', marginTop: '6px' }}>{lastDispatchedTrip.customerName} • {lastDispatchedTrip.currency} {lastDispatchedTrip.fare}</div>
                <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '4px' }}>Motorista: {lastDispatchedTrip.driverAssigned}</div>
              </div>

              <div style={{ backgroundColor: '#0A2518', padding: '16px', borderRadius: '10px', border: '1px solid #10B981' }}>
                <div style={{ color: '#10B981', fontWeight: '700', fontSize: '12px', marginBottom: '6px' }}>MENSAGEM ENVIADA AO CLIENTE VIA WHATSAPP:</div>
                <p style={{ color: '#E2E8F0', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                  "{lastDispatchedTrip.whatsappMessage}"
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#64748B', padding: '60px 20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📞</div>
              <p>Nenhuma corrida despachada nesta sessão. Preencha o telefone do passageiro ao lado para despachar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
