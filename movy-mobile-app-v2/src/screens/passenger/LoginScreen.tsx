import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n, CountryCode } from '../../i18n';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [country, setCountry] = useState<CountryCode>('US');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneLoginEnabled, setPhoneLoginEnabled] = useState(false); // Carregado do Monitor

  useEffect(() => {
    i18n.setCountry(country);
    // Simulação da leitura das configurações públicas do backend (Monitor)
    // Se enable_phone_login_otp estiver true, o botão de SMS aparece
    fetch('http://localhost:8080/settings/public')
      .then((res) => res.json())
      .then((data) => setPhoneLoginEnabled(data.enable_phone_login_otp))
      .catch(() => setPhoneLoginEnabled(false));
  }, [country]);

  const t = i18n.t();

  const handleLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: 1,
        name: 'Alexandre Customer',
        email,
        country,
      });
    }, 600);
  };

  return (
    <View style={styles.container}>
      {/* Seletor de País de Alta Ergonomia */}
      <View style={styles.countrySelectorContainer}>
        <TouchableOpacity
          style={[styles.countryButton, country === 'US' && styles.countryButtonActive]}
          onPress={() => setCountry('US')}
        >
          <Text style={[styles.countryText, country === 'US' && styles.countryTextActive]}>🇺🇸 United States ($ USD)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.countryButton, country === 'BR' && styles.countryButtonActive]}
          onPress={() => setCountry('BR')}
        >
          <Text style={[styles.countryText, country === 'BR' && styles.countryTextActive]}>🇧🇷 Brasil (R$ BRL)</Text>
        </TouchableOpacity>
      </View>

      {/* Header com Logo MOVY */}
      <View style={styles.header}>
        <Text style={styles.logoText}>MOVY</Text>
        <Text style={styles.subLogoText}>RIDE & MOBILITY</Text>
        <Text style={styles.title}>{t.loginTitle}</Text>
      </View>

      {/* Formulário Principal: E-mail e Senha */}
      <View style={styles.form}>
        <Text style={styles.label}>{t.emailLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@movymob.com"
          placeholderTextColor={MOVY_THEME.colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>{t.passwordLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••••••"
          placeholderTextColor={MOVY_THEME.colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Botão de Ação Primária no Ciano Elétrico da Logo */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={MOVY_THEME.colors.background} />
          ) : (
            <Text style={styles.primaryButtonText}>{t.loginButton}</Text>
          )}
        </TouchableOpacity>

        {/* Botão de Login por Telefone/SMS (Apenas visível se ativado no Monitor) */}
        {phoneLoginEnabled && (
          <TouchableOpacity style={styles.phoneButton}>
            <Text style={styles.phoneButtonText}>{t.loginWithPhone}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.registerLink} onPress={onNavigateToRegister}>
          <Text style={styles.registerLinkText}>
            {country === 'US' ? "Don't have an account? Sign Up" : 'Não tem uma conta? Cadastre-se'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOVY_THEME.colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  countrySelectorContainer: {
    flexDirection: 'row',
    backgroundColor: MOVY_THEME.colors.surface,
    borderRadius: MOVY_THEME.borderRadius.full,
    padding: 4,
    marginBottom: 28,
  },
  countryButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: MOVY_THEME.borderRadius.full,
  },
  countryButtonActive: {
    backgroundColor: MOVY_THEME.colors.brandBlue,
  },
  countryText: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  countryTextActive: {
    color: MOVY_THEME.colors.textPrimary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    color: MOVY_THEME.colors.primary,
    letterSpacing: 2,
  },
  subLogoText: {
    fontSize: 11,
    fontWeight: '700',
    color: MOVY_THEME.colors.textSecondary,
    letterSpacing: 3,
    marginTop: -4,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: MOVY_THEME.colors.textPrimary,
  },
  form: {
    width: '100%',
  },
  label: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: MOVY_THEME.colors.surface,
    borderColor: MOVY_THEME.colors.border,
    borderWidth: 1,
    borderRadius: MOVY_THEME.borderRadius.md,
    color: MOVY_THEME.colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: MOVY_THEME.colors.primary,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: MOVY_THEME.colors.background,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  phoneButton: {
    borderColor: MOVY_THEME.colors.primary,
    borderWidth: 1,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  phoneButtonText: {
    color: MOVY_THEME.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    color: MOVY_THEME.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
