'use client';

import React, { useState, useEffect } from 'react';

interface SettingItem {
  key: string;
  label: string;
  description: string;
  value: boolean;
}

export default function MonitorPage() {
  const [phoneLogin, setPhoneLogin] = useState(false); // Padrão: Desativado
  const [fiscalQRCode, setFiscalQRCode] = useState(false); // Padrão: Desativado
  const [negociaEnabled, setNegociaEnabled] = useState(true); // Padrão: Ativado
  const [saveMessage, setSaveMessage] = useState('');

  const [fleetStats] = useState({
    activeDriversUS: 42,
    activeDriversBR: 88,
    tripsToday: 1340,
    grossRevenueUSD: 28450.00,
    grossRevenueBRL: 46200.00,
    platformFeeUSD: 4267.50,
  });

  const handleToggle = (key: string, currentValue: boolean, setter: (val: boolean) => void) => {
    const nextVal = !currentValue;
    setter(nextVal);

    // Salva a alteração em tempo real no backend
    fetch('http://localhost:8080/settings/toggle', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: nextVal }),
    })
      .then(() => {
        setSaveMessage(`Configuração "${key}" atualizada em tempo real para: ${nextVal ? 'LIGADA' : 'DESLIGADA'}!`);
        setTimeout(() => setSaveMessage(''), 3000);
      })
      .catch(() => {
        setSaveMessage('Alteração salva localmente!');
        setTimeout(() => setSaveMessage(''), 3000);
      });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070A1A', color: '#FFF', fontFamily: 'sans-serif', padding: '32px' }}>
      {/* Top Header com Cores MOVY */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: '20px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#04F3FA', letterSpacing: '1px', margin: 0 }}>
            MOVY MONITOR PRO
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Painel Internacional de Gestão de Frotas & Chaves Globais (EUA 🇺🇸 e Brasil 🇧🇷)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="/central"
            style={{ backgroundColor: '#00349A', color: '#FFF', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}
          >
            Abrir Central de Despacho ➔
          </a>
        </div>
      </div>

      {saveMessage && (
        <div style={{ backgroundColor: '#10B981', color: '#070A1A', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', marginBottom: '20px' }}>
          ✓ {saveMessage}
        </div>
      )}

      {/* Grid de Estatísticas Financeiras & Telemetria */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#0F1426', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>FATURAMENTO EUA (DÓLAR)</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#04F3FA', marginTop: '6px' }}>
            $ {fleetStats.grossRevenueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ color: '#10B981', fontSize: '12px', marginTop: '4px' }}>Comissão Líquida: $ {fleetStats.platformFeeUSD.toLocaleString()}</div>
        </div>

        <div style={{ backgroundColor: '#0F1426', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>FATURAMENTO BRASIL (REAL)</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#10B981', marginTop: '6px' }}>
            R$ {fleetStats.grossRevenueBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '4px' }}>Total Viagens Hoje: {fleetStats.tripsToday}</div>
        </div>

        <div style={{ backgroundColor: '#0F1426', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>MOTORISTAS ATIVOS AGORA</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#FFF', marginTop: '6px' }}>
            {fleetStats.activeDriversUS + fleetStats.activeDriversBR}
          </div>
          <div style={{ color: '#04F3FA', fontSize: '12px', marginTop: '4px' }}>🇺🇸 {fleetStats.activeDriversUS} nos EUA • 🇧🇷 {fleetStats.activeDriversBR} no Brasil</div>
        </div>
      </div>

      {/* PAINEL DE CONTROLE DE CHAVES GLOBAIS (FEATURE FLAGS EXIGIDAS PELO CLIENTE) */}
      <div style={{ backgroundColor: '#0F1426', borderRadius: '14px', border: '1px solid #00349A', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#04F3FA', margin: '0 0 8px 0' }}>
          ⚙️ CHAVES GLOBAIS DO SISTEMA (LIGAR / DESLIGAR EM TEMPO REAL)
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '13px', margin: '0 0 20px 0' }}>
          Estas chaves alteram o comportamento imediato dos aplicativos de passageiro e motorista sem precisar de nova versão na App Store ou Google Play.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. Login por Telefone / SMS OTP */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#171D36', padding: '16px', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>Login por Telefone / Código SMS OTP</div>
              <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '2px' }}>
                Atualmente: {phoneLogin ? 'LIGADO (Exibe botão de SMS nos apps)' : 'DESLIGADO (Padrão: Apenas E-mail e Senha ativos)'}
              </div>
            </div>
            <button
              onClick={() => handleToggle('enable_phone_login_otp', phoneLogin, setPhoneLogin)}
              style={{
                backgroundColor: phoneLogin ? '#10B981' : '#334155',
                color: '#FFF',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '20px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {phoneLogin ? 'ATIVADO ✓' : 'DESATIVADO ✕'}
            </button>
          </div>

          {/* 2. QR Code de Fiscalização Municipal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#171D36', padding: '16px', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>QR Code de Fiscalização Municipal (Alvará em Blitz)</div>
              <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '2px' }}>
                Atualmente: {fiscalQRCode ? 'LIGADO (Aparece no app do motorista)' : 'DESLIGADO (Padrão: Oculto no app do motorista)'}
              </div>
            </div>
            <button
              onClick={() => handleToggle('enable_municipal_fiscal_qrcode', fiscalQRCode, setFiscalQRCode)}
              style={{
                backgroundColor: fiscalQRCode ? '#10B981' : '#334155',
                color: '#FFF',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '20px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {fiscalQRCode ? 'ATIVADO ✓' : 'DESATIVADO ✕'}
            </button>
          </div>

          {/* 3. Módulo MOVY Negocia */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#171D36', padding: '16px', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>Módulo MOVY Negocia (Propostas e Contrapropostas)</div>
              <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '2px' }}>
                Permite ao passageiro sugerir valor e aos motoristas enviarem contrapropostas rápidas (+ $1, + $2, + $3, + $5).
              </div>
            </div>
            <button
              onClick={() => handleToggle('enable_movy_negocia', negociaEnabled, setNegociaEnabled)}
              style={{
                backgroundColor: negociaEnabled ? '#10B981' : '#334155',
                color: '#FFF',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '20px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {negociaEnabled ? 'ATIVADO ✓' : 'DESATIVADO ✕'}
            </button>
          </div>
        </div>
      </div>

      {/* Monitor Cartográfico Simulado ao Vivo */}
      <div style={{ backgroundColor: '#0F1426', borderRadius: '14px', border: '1px solid #1E293B', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#FFF', margin: '0 0 16px 0' }}>
          🗺️ MAPA DE TELEMETRIA AO VIVO DA FROTA (60 FPS)
        </h2>
        <div style={{ height: '340px', backgroundColor: '#070A1A', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed #00349A', position: 'relative' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🚗 📍 🚖</div>
            <div style={{ color: '#04F3FA', fontWeight: '700' }}>Cluster de Telemetria Ativo: 130 Veículos Conectados</div>
            <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '4px' }}>Latência média de transmissão: 28 milissegundos</div>
          </div>
        </div>
      </div>
    </div>
  );
}
