import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n } from '../../i18n';

export const DriverCockpitScreen: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [balance, setBalance] = useState(185.00); // Saldo disponível em Dólar
  const [dailyGoal] = useState(250.00);
  const [incomingOffer, setIncomingOffer] = useState<any>(null);
  const [fiscalQRCodeEnabled, setFiscalQRCodeEnabled] = useState(false); // Carregado do Monitor

  const country = i18n.getCountry();
  const currency = country === 'US' ? '$' : 'R$';

  useEffect(() => {
    // Busca do status da chave de QR Code municipal do Monitor
    fetch('http://localhost:8080/settings/public')
      .then((res) => res.json())
      .then((data) => setFiscalQRCodeEnabled(data.enable_municipal_fiscal_qrcode))
      .catch(() => setFiscalQRCodeEnabled(false));
  }, []);

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);

    if (nextState) {
      // Simulação de corrida recebida no modo MOVY Negocia após 2 segundos
      setTimeout(() => {
        setIncomingOffer({
          id: 'offer_' + Math.floor(Math.random() * 1000),
          passengerName: 'Sarah Jenkins',
          passengerRating: 4.95,
          pickupAddress: 'Brickell Ave, Miami, FL',
          destinationAddress: 'Ocean Dr, Miami Beach, FL',
          distancePickup: '1.2 miles (4 min)',
          tripDistance: '6.8 miles (18 min)',
          passengerOffer: country === 'US' ? 22.00 : 35.00,
        });
      }, 2000);
    } else {
      setIncomingOffer(null);
    }
  };

  const handleCounterOffer = (increment: number) => {
    const newPrice = incomingOffer.passengerOffer + increment;
    Alert.alert(
      country === 'US' ? 'Counter-Offer Sent' : 'Contraproposta Enviada',
      country === 'US'
        ? `You proposed ${currency} ${newPrice.toFixed(2)} to ${incomingOffer.passengerName}. Waiting for passenger...`
        : `Você propôs ${currency} ${newPrice.toFixed(2)} para ${incomingOffer.passengerName}. Aguardando...`
    );
    setIncomingOffer(null);
  };

  const handleCashout = () => {
    const method = country === 'US' ? 'Zelle' : 'Pix';
    Alert.alert(
      country === 'US' ? 'Instant Cash Out' : 'Saque Instantâneo',
      country === 'US'
        ? `Transfer of $ ${balance.toFixed(2)} sent via Zelle to your registered bank account!`
        : `Transferência de R$ ${balance.toFixed(2)} enviada via Pix para sua conta!`,
      [{ text: 'OK', onPress: () => setBalance(0.00) }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Barra de Status e Alternância Online/Offline */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>DRIVER COCKPIT</Text>
          <Text style={styles.subGreeting}>
            {country === 'US' ? 'Miami / Florida Region' : 'Região de São Paulo'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.onlineButton, isOnline && styles.onlineButtonActive]}
          onPress={handleToggleOnline}
        >
          <View style={[styles.onlineIndicator, isOnline && styles.onlineIndicatorActive]} />
          <Text style={styles.onlineButtonText}>{isOnline ? 'ONLINE' : 'GO ONLINE'}</Text>
        </TouchableOpacity>
      </View>

      {/* Card Financeiro de Metas & Saldo */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          {country === 'US' ? 'TODAY EARNINGS (AVAILABLE)' : 'GANHOS DE HOJE (DISPONÍVEL)'}
        </Text>
        <Text style={styles.balanceValue}>
          {currency} {balance.toFixed(2)}
        </Text>

        {/* Progresso da Meta Diária */}
        <View style={styles.goalRow}>
          <Text style={styles.goalText}>
            {country === 'US'
              ? `Daily Goal: $ ${balance.toFixed(0)} / $ ${dailyGoal.toFixed(0)} (${Math.round((balance/dailyGoal)*100)}%)`
              : `Meta Diária: R$ ${balance.toFixed(0)} / R$ ${dailyGoal.toFixed(0)} (${Math.round((balance/dailyGoal)*100)}%)`}
          </Text>
        </View>

        {/* BOTÃO DE SAQUE INSTANTÂNEO: ZELLE (EUA) OU PIX (BRASIL) */}
        <TouchableOpacity style={styles.cashoutButton} onPress={handleCashout} disabled={balance <= 0}>
          <Text style={styles.cashoutButtonText}>
            {country === 'US' ? '⚡ Instant Cash Out via Zelle' : '⚡ Saque Instantâneo via Pix'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal/Card de Corrida Recebida no Modo MOVY NEGOCIA */}
      {incomingOffer && (
        <View style={styles.offerCard}>
          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>MOVY NEGOCIA</Text>
          </View>

          <Text style={styles.passengerOfferText}>
            {country === 'US' ? 'Passenger Offered:' : 'Proposta do Passageiro:'}
          </Text>
          <Text style={styles.offerPriceValue}>
            {currency} {incomingOffer.passengerOffer.toFixed(2)}
          </Text>

          <View style={styles.routeDetails}>
            <Text style={styles.routePoint}>📍 Pickup: {incomingOffer.pickupAddress} ({incomingOffer.distancePickup})</Text>
            <Text style={styles.routePoint}>🏁 Destination: {incomingOffer.destinationAddress} ({incomingOffer.tripDistance})</Text>
          </View>

          {/* BOTÕES RÁPIDOS DE CONTRAPROPOSTA COM O POLEGAR */}
          <Text style={styles.counterTitle}>
            {country === 'US' ? 'Send Quick Counter-Offer:' : 'Contraproposta Rápida:'}
          </Text>
          <View style={styles.counterRow}>
            {(country === 'US' ? [1, 2, 3, 5] : [2, 3, 5, 10]).map((inc) => (
              <TouchableOpacity
                key={inc}
                style={styles.counterChip}
                onPress={() => handleCounterOffer(inc)}
              >
                <Text style={styles.counterChipText}>+ {currency}{inc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botão de Aceitar Valor Original */}
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => {
              Alert.alert('Accepted', 'Trip assigned to you! Proceed to pickup location.');
              setIncomingOffer(null);
            }}
          >
            <Text style={styles.acceptButtonText}>
              {country === 'US' ? `Accept for ${currency} ${incomingOffer.passengerOffer.toFixed(2)}` : `Aceitar por ${currency} ${incomingOffer.passengerOffer.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* BOTÃO DE QR CODE MUNICIPAL: APARECE APENAS SE ATIVADO NO MONITOR */}
      {fiscalQRCodeEnabled && (
        <TouchableOpacity style={styles.fiscalButton}>
          <Text style={styles.fiscalButtonText}>🏛️ QR Code Fiscal de Trânsito / Alvará</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOVY_THEME.colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    color: MOVY_THEME.colors.primary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subGreeting: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 12,
  },
  onlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MOVY_THEME.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: MOVY_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  onlineButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: MOVY_THEME.colors.success,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MOVY_THEME.colors.danger,
    marginRight: 8,
  },
  onlineIndicatorActive: {
    backgroundColor: MOVY_THEME.colors.success,
  },
  onlineButtonText: {
    color: MOVY_THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  balanceCard: {
    backgroundColor: MOVY_THEME.colors.surface,
    borderRadius: MOVY_THEME.borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.border,
    marginBottom: 20,
  },
  balanceLabel: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    marginVertical: 4,
  },
  goalRow: {
    marginTop: 4,
    marginBottom: 16,
  },
  goalText: {
    color: MOVY_THEME.colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  cashoutButton: {
    backgroundColor: MOVY_THEME.colors.success,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cashoutButtonText: {
    color: '#070A1A',
    fontSize: 15,
    fontWeight: '800',
  },
  offerCard: {
    backgroundColor: MOVY_THEME.colors.surfaceElevated,
    borderRadius: MOVY_THEME.borderRadius.lg,
    padding: 20,
    borderWidth: 2,
    borderColor: MOVY_THEME.colors.primary,
    marginBottom: 20,
  },
  offerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: MOVY_THEME.colors.brandBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: MOVY_THEME.borderRadius.sm,
    marginBottom: 10,
  },
  offerBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  passengerOfferText: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 13,
  },
  offerPriceValue: {
    color: MOVY_THEME.colors.primary,
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 12,
  },
  routeDetails: {
    backgroundColor: MOVY_THEME.colors.surface,
    padding: 12,
    borderRadius: MOVY_THEME.borderRadius.md,
    marginBottom: 16,
  },
  routePoint: {
    color: MOVY_THEME.colors.textPrimary,
    fontSize: 12,
    marginVertical: 2,
  },
  counterTitle: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  counterChip: {
    flex: 1,
    backgroundColor: MOVY_THEME.colors.surface,
    borderColor: MOVY_THEME.colors.primary,
    borderWidth: 1,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  counterChipText: {
    color: MOVY_THEME.colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  acceptButton: {
    backgroundColor: MOVY_THEME.colors.primary,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: MOVY_THEME.colors.background,
    fontSize: 15,
    fontWeight: '800',
  },
  fiscalButton: {
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.border,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  fiscalButtonText: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
