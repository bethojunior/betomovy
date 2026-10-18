import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n } from '../../i18n';

interface TripReceiptModalProps {
  visible: boolean;
  receipt: any;
  onClose: () => void;
}

export const TripReceiptModal: React.FC<TripReceiptModalProps> = ({
  visible,
  receipt,
  onClose,
}) => {
  const country = i18n.getCountry();
  const currency = country === 'US' ? '$' : 'R$';

  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(0);
  const [feedback, setFeedback] = useState('');

  if (!receipt) return null;

  const TIP_OPTIONS = country === 'US'
    ? [{ label: 'None', value: 0 }, { label: '+$1.00', value: 1 }, { label: '+$2.00', value: 2 }, { label: '+$5.00', value: 5 }]
    : [{ label: 'Zero', value: 0 }, { label: '+R$ 2', value: 2 }, { label: '+R$ 5', value: 5 }, { label: '+R$ 10', value: 10 }];

  const totalPaid = Number(receipt.fare) + tip;

  const handleSubmitRatingAndClose = () => {
    Alert.alert(
      country === 'US' ? 'Thank You!' : 'Obrigado!',
      country === 'US'
        ? `Your feedback and rating of ${rating} stars was sent. Receipt emailed.`
        : `Sua avaliação de ${rating} estrelas foi enviada! Recibo gerado.`
    );
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.title}>
              {country === 'US' ? 'Ride Completed' : 'Viagem Concluída'}
            </Text>
            <Text style={styles.subtitle}>{receipt.driverName} • {receipt.vehicle}</Text>
          </View>

          {/* Valor Total */}
          <View style={styles.fareContainer}>
            <Text style={styles.fareLabel}>
              {country === 'US' ? 'TOTAL CHARGED' : 'VALOR COBRADO'}
            </Text>
            <Text style={styles.fareValue}>
              {currency} {totalPaid.toFixed(2)}
            </Text>
            <Text style={styles.tripMetrics}>
              {receipt.distance} • {receipt.duration}
            </Text>
          </View>

          {/* Seletor de Gorjeta (Driver Tip) */}
          <Text style={styles.sectionLabel}>
            {country === 'US' ? 'Add Driver Tip (Optional):' : 'Adicionar Gorjeta (Opcional):'}
          </Text>
          <View style={styles.tipRow}>
            {TIP_OPTIONS.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.tipChip, tip === opt.value && styles.tipChipActive]}
                onPress={() => setTip(opt.value)}
              >
                <Text style={[styles.tipText, tip === opt.value && styles.tipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Avaliação em Estrelas (1 a 5) */}
          <Text style={styles.sectionLabel}>
            {country === 'US' ? 'Rate your Driver:' : 'Avalie seu Motorista:'}
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={[styles.starIcon, rating >= star && styles.starActive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Opcional */}
          <TextInput
            style={styles.feedbackInput}
            placeholder={country === 'US' ? 'Leave a compliment for Carlos...' : 'Deixe um elogio...'}
            placeholderTextColor="#64748B"
            value={feedback}
            onChangeText={setFeedback}
          />

          {/* Botão de Conclusão */}
          <TouchableOpacity style={styles.doneButton} onPress={handleSubmitRatingAndClose}>
            <Text style={styles.doneButtonText}>
              {country === 'US' ? 'Submit & Back to Map' : 'Confirmar & Voltar ao Mapa'}
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
    backgroundColor: 'rgba(7, 10, 26, 0.9)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#0F1426',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    color: '#070A1A',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  fareContainer: {
    backgroundColor: '#070A1A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 18,
  },
  fareLabel: {
    color: MOVY_THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  fareValue: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
  },
  tripMetrics: {
    color: '#94A3B8',
    fontSize: 12,
  },
  sectionLabel: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tipChip: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tipChipActive: {
    backgroundColor: MOVY_THEME.colors.brandBlue,
    borderColor: MOVY_THEME.colors.brandCyan,
  },
  tipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
  },
  tipTextActive: {
    color: '#FFF',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  starIcon: {
    fontSize: 34,
    color: '#334155',
  },
  starActive: {
    color: '#FBBF24',
  },
  feedbackInput: {
    backgroundColor: '#070A1A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#1E293B',
    fontSize: 13,
    marginBottom: 18,
  },
  doneButton: {
    backgroundColor: MOVY_THEME.colors.brandCyan,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#070A1A',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
