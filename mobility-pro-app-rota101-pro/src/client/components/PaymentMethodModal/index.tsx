// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTrip } from '../../contexts/Trip';
import { translate } from '../../locales';

interface PaymentMethodModalProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  isSpeedmob?: boolean;
}

export default function PaymentMethodModal({
  visible,
  setVisible,
}: PaymentMethodModalProps) {
  const {
    handleSelectedPaymentMethod,
    stateTripCustomer,
    getTripPaymentMethods,
  } = useTrip();

  const { tripPaymentMethods, selectedPaymentMethod } = stateTripCustomer || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && (!tripPaymentMethods || tripPaymentMethods.length === 0)) {
      setLoading(true);
      Promise.resolve(getTripPaymentMethods?.())
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [visible, tripPaymentMethods, getTripPaymentMethods]);

  const getMethodIcon = (item: any) => {
    const typeId = Number(item?.paymentFormTypeId);
    const name = String(item?.name || '').toUpperCase();

    if (typeId === 3 || name.includes('STRIPE') || name.includes('CARD') || name.includes('CARTÃO')) {
      return 'card-outline';
    }
    if (typeId === 2 || name.includes('CASH') || name.includes('DINHEIRO')) {
      return 'cash-outline';
    }
    if (typeId === 1 || name.includes('VOUCHER') || name.includes('SALDO')) {
      return 'wallet-outline';
    }
    return 'card-outline';
  };

  const getMethodDescription = (item: any) => {
    if (item?.description && item.description.trim() !== '') {
      return item.description;
    }
    const typeId = Number(item?.paymentFormTypeId);
    const name = String(item?.name || '').toUpperCase();
    if (typeId === 3 || name.includes('STRIPE')) {
      return 'Cartão de crédito pelo app (Stripe)';
    }
    if (typeId === 2 || name.includes('CASH')) {
      return 'Pagamento direto ao motorista';
    }
    if (typeId === 1 || name.includes('VOUCHER')) {
      return 'Saldo em conta no aplicativo';
    }
    return '';
  };

  const isSelected = (item: any) => {
    if (!selectedPaymentMethod) return false;
    if (selectedPaymentMethod.idTripPaymentForm && item.idTripPaymentForm) {
      return Number(selectedPaymentMethod.idTripPaymentForm) === Number(item.idTripPaymentForm);
    }
    if (selectedPaymentMethod.paymentFormTypeId && item.paymentFormTypeId) {
      return Number(selectedPaymentMethod.paymentFormTypeId) === Number(item.paymentFormTypeId);
    }
    return selectedPaymentMethod.name === item.name;
  };

  const renderItem = ({ item }: { item: any }) => {
    const selected = isSelected(item);
    const iconName = getMethodIcon(item);
    const desc = getMethodDescription(item);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          handleSelectedPaymentMethod(item);
          setVisible(false);
        }}
        style={[styles.itemCard, selected && styles.itemCardSelected]}
      >
        <View style={[styles.iconCircle, selected && styles.iconCircleSelected]}>
          <Ionicons
            name={iconName}
            size={22}
            color={selected ? '#FFFFFF' : '#3B82F6'}
          />
        </View>

        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, selected && styles.itemNameSelected]}>
            {item.name}
          </Text>
          {desc ? (
            <Text style={styles.itemDesc} numberOfLines={1}>
              {desc}
            </Text>
          ) : null}
        </View>

        <Ionicons
          name={selected ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={selected ? '#22C55E' : 'rgba(255,255,255,0.25)'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
        <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIcon}>
                <Ionicons name="card" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.headerTitle}>
                {translate('schedule.method_payment') || 'Opções de pagamento'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Subtitle / hint */}
          <Text style={styles.headerSubtitle}>
            Escolha como deseja pagar pela sua viagem
          </Text>

          {/* Content */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.loadingText}>Carregando formas de pagamento...</Text>
            </View>
          ) : (
            <FlatList
              data={tripPaymentMethods || []}
              keyExtractor={(item) => String(item.idTripPaymentForm || item.name)}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="alert-circle-outline" size={32} color="#94A3B8" />
                  <Text style={styles.emptyText}>
                    Nenhuma forma de pagamento disponível no momento.
                  </Text>
                </View>
              }
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 16,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    gap: 10,
    paddingBottom: 6,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  itemCardSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: '#3B82F6',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCircleSelected: {
    backgroundColor: '#3B82F6',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1F5F9',
    letterSpacing: 0.2,
  },
  itemNameSelected: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  itemDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  loadingContainer: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
