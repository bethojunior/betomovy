import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n } from '../../i18n';
import { MovyApiService } from '../../services/api';

interface TripActiveScreenProps {
  trip: any;
  onOpenChat: () => void;
  onOpenSos: () => void;
  onTripCompleted: (receipt: any) => void;
  onCancelTrip: () => void;
}

export const TripActiveScreen: React.FC<TripActiveScreenProps> = ({
  trip,
  onOpenChat,
  onOpenSos,
  onTripCompleted,
  onCancelTrip,
}) => {
  const country = i18n.getCountry();
  const currency = country === 'US' ? '$' : 'R$';

  const handleSimulateArrivalAndComplete = () => {
    // Simula a chegada e finalização da viagem
    const receipt = {
      tripId: trip.id,
      driverName: trip.driverName,
      vehicle: trip.vehicle,
      fare: trip.fare,
      currency,
      distance: country === 'US' ? '4.8 miles' : '7.2 km',
      duration: '14 mins',
    };
    onTripCompleted(receipt);
  };

  return (
    <View style={styles.container}>
      {/* Visual do Mapa com Telemetria e Carrinho a 60 FPS */}
      <View style={styles.mapArea}>
        <View style={styles.topHud}>
          <View style={styles.etaBadge}>
            <Text style={styles.etaLabel}>{country === 'US' ? 'DRIVER ARRIVING IN' : 'MOTORISTA CHEGANDO EM'}</Text>
            <Text style={styles.etaValue}>3 MIN</Text>
          </View>

          {/* Botão SOS de Emergência no Topo Direito */}
          <TouchableOpacity style={styles.sosButton} onPress={onOpenSos}>
            <Text style={styles.sosText}>🚨 SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Carrinho em Movimento 60 FPS */}
        <View style={styles.driverCarMarker}>
          <Text style={styles.driverCarIcon}>🚘</Text>
          <View style={styles.driverCarPulse} />
        </View>
      </View>

      {/* Painel Inferior Flutuante (Card do Motorista e PIN de Segurança) */}
      <View style={styles.bottomCard}>
        {/* Banner do PIN de 4 Dígitos */}
        <View style={styles.pinBanner}>
          <Text style={styles.pinLabel}>
            {country === 'US' ? 'SAFETY PIN FOR DRIVER' : 'PIN DE EMBARQUE SEGURO'}
          </Text>
          <Text style={styles.pinCode}>{trip.pin_code || '4821'}</Text>
          <Text style={styles.pinSubtext}>
            {country === 'US'
              ? 'Give this 4-digit code to Carlos before boarding'
              : 'Informe este código de 4 dígitos ao motorista antes de embarcar'}
          </Text>
        </View>

        {/* Informações do Veículo e Motorista */}
        <View style={styles.driverRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>CM</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.driverName}>{trip.driverName || 'Carlos Mendez'}</Text>
              <Text style={styles.ratingBadge}> ⭐ 4.98</Text>
            </View>
            <Text style={styles.vehicleInfo}>{trip.vehicle || 'Toyota Camry 2024 • Plate 7XYZ89'}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.fareTotal}>
              {currency} {Number(trip.fare).toFixed(2)}
            </Text>
            <Text style={styles.fareTag}>
              {trip.status === 'negotiating' ? 'MOVY NEGOCIA' : 'ESTIMATED'}
            </Text>
          </View>
        </View>

        {/* Barra de Ações Rápidas: Chat, Compartilhar Rota e Cancelar */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.chatButton} onPress={onOpenChat}>
            <Text style={styles.chatButtonText}>💬 {country === 'US' ? 'Chat / Audio' : 'Mensagem / Áudio'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              Alert.alert(
                country === 'US' ? 'Share Live Trip' : 'Compartilhar Rota',
                country === 'US'
                  ? `Live link copied: https://movymob.com/track/${trip.id}`
                  : `Link copiado: https://movymob.com/track/${trip.id}`
              );
            }}
          >
            <Text style={styles.shareButtonText}>🔗 {country === 'US' ? 'Share' : 'Compartilhar'}</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Simulação de Fim de Viagem para Demonstração */}
        <TouchableOpacity style={styles.completeTripButton} onPress={handleSimulateArrivalAndComplete}>
          <Text style={styles.completeTripButtonText}>
            🏁 {country === 'US' ? 'Simulate Trip Arrival & Payment' : 'Simular Chegada & Pagamento'}
          </Text>
        </TouchableOpacity>

        {/* Botão Cancelar Viagem */}
        <TouchableOpacity style={styles.cancelButton} onPress={onCancelTrip}>
          <Text style={styles.cancelButtonText}>
            {country === 'US' ? 'Cancel Ride' : 'Cancelar Viagem'}
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
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#0A0F24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHud: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  etaBadge: {
    backgroundColor: MOVY_THEME.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: MOVY_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  etaLabel: {
    color: MOVY_THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  etaValue: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  sosButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: MOVY_THEME.borderRadius.md,
    elevation: 4,
  },
  sosText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 13,
  },
  driverCarMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverCarIcon: {
    fontSize: 44,
  },
  driverCarPulse: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: MOVY_THEME.colors.brandCyan,
    opacity: 0.6,
    marginTop: -4,
  },
  bottomCard: {
    backgroundColor: MOVY_THEME.colors.surface,
    borderTopLeftRadius: MOVY_THEME.borderRadius.xl,
    borderTopRightRadius: MOVY_THEME.borderRadius.xl,
    padding: 24,
    borderTopWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  pinBanner: {
    backgroundColor: '#0F172A',
    borderRadius: MOVY_THEME.borderRadius.md,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.brandBlue,
    marginBottom: 18,
  },
  pinLabel: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pinCode: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
    marginVertical: 4,
  },
  pinSubtext: {
    color: MOVY_THEME.colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: MOVY_THEME.colors.brandBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
  },
  driverName: {
    color: MOVY_THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  ratingBadge: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '800',
  },
  vehicleInfo: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  fareTotal: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 18,
    fontWeight: '900',
  },
  fareTag: {
    color: MOVY_THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  chatButton: {
    flex: 2,
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: MOVY_THEME.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  chatButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: MOVY_THEME.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  shareButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  completeTripButton: {
    backgroundColor: MOVY_THEME.colors.brandBlue,
    paddingVertical: 14,
    borderRadius: MOVY_THEME.borderRadius.md,
    alignItems: 'center',
    marginBottom: 10,
  },
  completeTripButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
});
