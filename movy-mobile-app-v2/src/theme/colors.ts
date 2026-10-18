export const MOVY_THEME = {
  colors: {
    // Fundo Principal Noturno de Alto Contraste (Deep Navy da marca MOVY)
    background: '#070A1A',
    surface: '#0F1426',
    surfaceElevated: '#171D36',
    surfaceGlass: 'rgba(15, 20, 38, 0.85)',

    // Cores Oficiais da Logo MOVY
    primary: '#04F3FA',          // Ciano / Turquesa Elétrico Vibrante da Logo
    primaryDark: '#00D2DF',      // Tom mais escuro para pressionamento de botão
    brandBlue: '#00349A',        // Azul Royal Corporativo da Logo
    brandBlueLight: '#004DE6',   // Azul vivo para rotas e destaques

    // Estados e Moeda
    success: '#10B981',          // Verde esmeralda para saldo em Dólar/Real e Zelle
    warning: '#F59E0B',          // Âmbar para Tarifa Dinâmica
    danger: '#EF4444',           // Vermelho alerta para Botão SOS de Pânico

    // Tipografia de Alto Contraste (Conformidade WCAG AAA)
    textPrimary: '#FFFFFF',      // Branco puro para títulos, preços e destinos
    textSecondary: '#94A3B8',    // Cinza titânio limpo para legendas e horários
    textMuted: '#64748B',        // Cinza neutro para placeholders
    border: '#1E293B',           // Divisores sutis
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 14,
    lg: 20,
    full: 9999,
  },
};
