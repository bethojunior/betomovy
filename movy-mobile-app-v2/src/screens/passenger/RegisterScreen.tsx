import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n, CountryCode } from '../../i18n';

interface RegisterScreenProps {
  onRegisterSuccess: (user: any) => void;
  onBackToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onBackToLogin }) => {
  const [country, setCountry] = useState<CountryCode>('US');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState(''); // Apenas para o Brasil
  const [zipCode, setZipCode] = useState('');

  const t = i18n.t();

  const handleRegister = () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Validação estrita: CPF só é validado e exigido se país for BR
    if (country === 'BR' && (!cpf || cpf.replace(/\D/g, '').length !== 11)) {
      Alert.alert('Erro', 'Por favor, informe um CPF válido.');
      return;
    }

    onRegisterSuccess({
      name,
      email,
      phone,
      country,
      ...(country === 'BR' ? { cpf } : {}), // NUNCA envia CPF nos EUA
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
        <Text style={styles.backButtonText}>← {country === 'US' ? 'Back' : 'Voltar'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{country === 'US' ? 'Create Account' : 'Criar Conta'}</Text>
      <Text style={styles.subtitle}>
        {country === 'US' 
          ? 'Sign up to ride with MOVY in the United States' 
          : 'Cadastre-se para viajar com a MOVY no Brasil'}
      </Text>

      {/* Seletor de País */}
      <View style={styles.countrySelector}>
        <TouchableOpacity
          style={[styles.countryChip, country === 'US' && styles.countryChipActive]}
          onPress={() => { setCountry('US'); i18n.setCountry('US'); }}
        >
          <Text style={[styles.countryChipText, country === 'US' && styles.countryChipTextActive]}>
            🇺🇸 United States
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.countryChip, country === 'BR' && styles.countryChipActive]}
          onPress={() => { setCountry('BR'); i18n.setCountry('BR'); }}
        >
          <Text style={[styles.countryChipText, country === 'BR' && styles.countryChipTextActive]}>
            🇧🇷 Brasil
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>{country === 'US' ? 'Full Name' : 'Nome Completo'}</Text>
        <TextInput
          style={styles.input}
          placeholder={country === 'US' ? 'John Smith' : 'João da Silva'}
          placeholderTextColor={MOVY_THEME.colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>{country === 'US' ? 'Email Address' : 'E-mail'}</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@movymob.com"
          placeholderTextColor={MOVY_THEME.colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>{country === 'US' ? 'Phone (+1)' : 'Telefone Celular (+55)'}</Text>
        <TextInput
          style={styles.input}
          placeholder={country === 'US' ? '+1 (305) 555-0199' : '(11) 98765-4321'}
          placeholderTextColor={MOVY_THEME.colors.textMuted}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* CAMPO DE CPF: RENDERIZAÇÃO ESTRITAMENTE CONDICIONAL (APENAS PARA O BRASIL) */}
        {country === 'BR' && (
          <View>
            <Text style={styles.label}>CPF (Apenas para o Brasil)</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor={MOVY_THEME.colors.textMuted}
              keyboardType="numeric"
              value={cpf}
              onChangeText={setCpf}
              maxLength={14}
            />
          </View>
        )}

        <Text style={styles.label}>{country === 'US' ? 'ZIP Code' : 'CEP'}</Text>
        <TextInput
          style={styles.input}
          placeholder={country === 'US' ? '33101' : '01310-100'}
          placeholderTextColor={MOVY_THEME.colors.textMuted}
          keyboardType="numeric"
          value={zipCode}
          onChangeText={setZipCode}
        />

        <Text style={styles.label}>{country === 'US' ? 'Password' : 'Senha'}</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••••••"
          placeholderTextColor={MOVY_THEME.colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
          <Text style={styles.submitButtonText}>
            {country === 'US' ? 'Create MOVY Account' : 'Concluir Cadastro'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOVY_THEME.colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: MOVY_THEME.colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: MOVY_THEME.colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: MOVY_THEME.colors.textSecondary,
    marginBottom: 24,
  },
  countrySelector: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  countryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: MOVY_THEME.borderRadius.full,
    backgroundColor: MOVY_THEME.colors.surface,
    marginRight: 10,
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  countryChipActive: {
    backgroundColor: MOVY_THEME.colors.brandBlue,
    borderColor: MOVY_THEME.colors.primary,
  },
  countryChipText: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  countryChipTextActive: {
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
  submitButton: {
    backgroundColor: MOVY_THEME.colors.primary,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: MOVY_THEME.colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
});
