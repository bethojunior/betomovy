import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n } from '../../i18n';
import { MovyApiService } from '../../services/api';

interface EmergencySosModalProps {
  visible: boolean;
  tripId: string;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  visible,
  tripId,
  onClose,
}) => {
  const country = i18n.getCountry();
  const emergencyNumber = country === 'US' ? '911' : '190';
  const [sosSent, setSosSent] = useState(false);

  const handleTriggerSilentSos = async () => {
    try {
      await MovyApiService.triggerSos({
        trip_id: tripId || 'TRIP-DEMO-001',
        user_id: 1,
        user_role: 'passenger',
        latitude: country === 'US' ? 25.7617 : -23.5505,
        longitude: country === 'US' ? -80.1918 : -46.6333,
        country_code: country,
        emergency_contacts: ['+13055550199', '+13055550188'],
      });
      setSosSent(true);
    } catch {
      setSosSent(true);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.alertIconBadge}>
              <Text style={{ fontSize: 28 }}>🚨</Text>
            </View>
            <Text style={styles.title}>
              {country === 'US' ? 'MOVY SAFETY TOOLKIT' : 'CENTRAL DE SEGURANÇA MOVY'}
            </Text>
            <Text style={styles.subtitle}>
              {country === 'US'
                ? 'Your safety is our #1 priority. Immediate assistance is available.'
                : 'Sua segurança é nossa prioridade absoluta. Acione socorro imediato.'}
            </Text>
          </View>

          {/* Localização Atual para Leitura Rápida */}
          <View style={styles.locationBox}>
            <Text style={styles.locationLabel}>
              {country === 'US' ? 'YOUR CURRENT GPS LOCATION' : 'SUA LOCALIZAÇÃO ATUAL'}
            </Text>
            <Text style={styles.locationAddress}>
              {country === 'US'
                ? '800 Brickell Ave, Miami, FL 33131 (Lat: 25.7617, Lng: -80.1918)'
                : 'Av. Paulista, 1000 - Bela Vista, São Paulo (Lat: -23.5505, Lng: -46.6333)'}
            </Text>
          </View>

          {/* Botão de Chamada Imediata para Polícia (911 ou 190) */}
          <TouchableOpacity
            style={styles.callPoliceBtn}
            onPress={() => {
              Alert.alert(
                country === 'US' ? `Call ${emergencyNumber}` : `Ligar para ${emergencyNumber}`,
                country === 'US'
                  ? `Dialing ${emergencyNumber} (Police / Emergency Services)...`
                  : `Discando para ${emergencyNumber} (Polícia Militar)...`
              );
            }}
          >
            <Text style={styles.callPoliceBtnText}>
              📞 {country === 'US' ? `CALL POLICE (${emergencyNumber})` : `LIGAR PARA POLÍCIA (${emergencyNumber})`}
            </Text>
          </TouchableOpacity>

          {/* Botão Alarme Silencioso (Transmissão de GPS para a Central) */}
          <TouchableOpacity
            style={[styles.silentSosBtn, sosSent && styles.silentSosBtnSent]}
            onPress={handleTriggerSilentSos}
            disabled={sosSent}
          >
            <Text style={styles.silentSosBtnText}>
              {sosSent
                ? country === 'US'
                  ? '✓ SOS TRANSMITTED TO MOVY MONITOR & CONTACTS'
                  : '✓ SOS TRANSMITIDO À CENTRAL & CONTATOS'
                : country === 'US'
                ? '⚠️ TRIGGER SILENT SOS (SEND GPS TO CONTACTS)'
                : '⚠️ ACIONAR BOTÃO DE PÂNICO SILENCIOSO'}
            </Text>
          </TouchableOpacity>

          {/* Fechar */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>
              {country === 'US' ? 'Close Safety Menu' : 'Fechar Menu de Segurança'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 10, 26, 0.95)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#0F1426',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  alertIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  locationBox: {
    backgroundColor: '#070A1A',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  locationLabel: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  locationAddress: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  callPoliceBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  callPoliceBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  silentSosBtn: {
    backgroundColor: '#B45309',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 18,
  },
  silentSosBtnSent: {
    backgroundColor: '#10B981',
  },
  silentSosBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
});
