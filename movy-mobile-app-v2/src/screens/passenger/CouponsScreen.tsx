import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n } from '../../i18n';
import { MovyApiService } from '../../services/api';

interface CouponsScreenProps {
  onBack: () => void;
  onApplyCouponSuccess?: (coupon: any) => void;
}

export const CouponsScreen: React.FC<CouponsScreenProps> = ({
  onBack,
  onApplyCouponSuccess,
}) => {
  const country = i18n.getCountry();
  const currency = country === 'US' ? '$' : 'R$';
  const [couponCode, setCouponCode] = useState('');

  const AVAILABLE_COUPONS = country === 'US'
    ? [
        { code: 'MOVYUSA', desc: '$5.00 OFF any ride', minTrip: '$10.00 min', expiry: 'Dec 2028' },
        { code: 'VIPMOVY', desc: '15% OFF MOVY Comfort', minTrip: '$15.00 min', expiry: 'Nov 2026' },
        { code: 'AIRPORT20', desc: '$7.00 OFF MIA/MCO Airport trips', minTrip: '$30.00 min', expiry: 'Dec 2026' },
      ]
    : [
        { code: 'BEMVINDO', desc: 'R$ 10.00 OFF na primeira viagem', minTrip: 'R$ 20.00 mín', expiry: 'Dez 2028' },
        { code: 'SPMOVY', desc: '10% OFF em viagens na capital', minTrip: 'R$ 25.00 mín', expiry: 'Nov 2026' },
        { code: 'AEROPORTO', desc: 'R$ 15.00 OFF p/ Guarulhos e Congonhas', minTrip: 'R$ 50.00 mín', expiry: 'Dez 2026' },
      ];

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponCode;
    if (!code.trim()) return;

    try {
      const res = await MovyApiService.applyCoupon({
        code,
        fare_total: 25.0,
        currency: country === 'US' ? 'USD' : 'BRL',
      });

      Alert.alert(
        country === 'US' ? 'Coupon Applied!' : 'Cupom Aplicado!',
        country === 'US'
          ? `Coupon ${code} applied successfully! You saved $${res.discount_applied.toFixed(2)}.`
          : `Cupom ${code} aplicado! Desconto de R$ ${res.discount_applied.toFixed(2)}.`
      );

      if (onApplyCouponSuccess) {
        onApplyCouponSuccess(res);
      }
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Cupom inválido.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {country === 'US' ? 'Promo Codes & Vouchers' : 'Cupons de Desconto'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Input de Inserção de Cupom */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>
            {country === 'US' ? 'HAVE A PROMO CODE?' : 'POSSUI UM CÓDIGO PROMOCIONAL?'}
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder={country === 'US' ? 'Enter code (e.g. MOVYUSA)' : 'Digite o cupom (ex: BEMVINDO)'}
              placeholderTextColor="#64748B"
              autoCapitalize="characters"
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <TouchableOpacity style={styles.applyButton} onPress={() => handleApplyCoupon()}>
              <Text style={styles.applyButtonText}>
                {country === 'US' ? 'APPLY' : 'APLICAR'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de Vouchers Disponíveis */}
        <Text style={styles.sectionTitle}>
          {country === 'US' ? 'Available Discounts for You' : 'Seus Cupons Disponíveis'}
        </Text>

        {AVAILABLE_COUPONS.map((c, idx) => (
          <View key={idx} style={styles.couponCard}>
            <View style={styles.couponLeft}>
              <Text style={styles.couponCode}>{c.code}</Text>
              <Text style={styles.couponDesc}>{c.desc}</Text>
              <Text style={styles.couponMeta}>
                {c.minTrip} • {country === 'US' ? 'Expires' : 'Válido até'} {c.expiry}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.useCouponBtn}
              onPress={() => handleApplyCoupon(c.code)}
            >
              <Text style={styles.useCouponBtnText}>
                {country === 'US' ? 'USE' : 'USAR'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOVY_THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  content: {
    padding: 20,
  },
  inputCard: {
    backgroundColor: '#0F1426',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 24,
  },
  inputLabel: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#070A1A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  applyButton: {
    backgroundColor: MOVY_THEME.colors.brandBlue,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  sectionTitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 14,
  },
  couponCard: {
    flexDirection: 'row',
    backgroundColor: '#0F1426',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12,
    alignItems: 'center',
  },
  couponLeft: {
    flex: 1,
  },
  couponCode: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  couponDesc: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  couponMeta: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },
  useCouponBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.brandCyan,
  },
  useCouponBtnText: {
    color: MOVY_THEME.colors.brandCyan,
    fontWeight: '800',
    fontSize: 12,
  },
});
