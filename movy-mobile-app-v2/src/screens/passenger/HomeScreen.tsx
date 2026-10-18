import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n } from '../../i18n';

interface RideCategory {
  id: string;
  name: string;
  eta: string;
  priceUSD: number;
  priceBRL: number;
  icon: string;
}

const CATEGORIES: RideCategory[] = [
  { id: 'eco', name: 'MOVY Eco', eta: '3 min', priceUSD: 14.50, priceBRL: 24.90, icon: '🚗' },
  { id: 'comfort', name: 'MOVY Comfort', eta: '5 min', priceUSD: 19.80, priceBRL: 32.50, icon: '🚘' },
  { id: 'speed', name: 'MOVY Speed', eta: '2 min', priceUSD: 9.50, priceBRL: 16.00, icon: '🏍️' },
  { id: 'freight', name: 'MOVY Freight', eta: '10 min', priceUSD: 34.00, priceBRL: 55.00, icon: '📦' },
];

export const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('eco');
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [isNegociaOpen, setIsNegociaOpen] = useState(false);

  const country = i18n.getCountry();
  const currency = country === 'US' ? '$' : 'R$';

  const handleRequestRide = (useNegocia: boolean = false) => {
    // Simulação da criação de corrida com PIN de 4 dígitos
    const selected = CATEGORIES.find((c) => c.id === selectedCategory);
    const fare = country === 'US' ? selected?.priceUSD : selected?.priceBRL;

    setActiveTrip({
      id: 'trip_' + Math.floor(Math.random() * 10000),
      driverName: 'Carlos M.',
      vehicle: 'Toyota Camry 2024 (Silver) • Plate 7XYZ89',
      rating: 4.98,
      fare,
      currency,
      pin_code: '4821', // PIN dinâmico que o passageiro informa ao motorista
      etaArrival: '4 min',
      status: useNegocia ? 'negotiating' : 'driver_en_route',
    });
  };

  return (
    <View style={styles.container}>
      {/* Visual do Mapa com Carrinhos Vetoriais em 60 FPS */}
      <View style={styles.mapMock}>
        <View style={styles.mapOverlayTop}>
          <View style={styles.statusPill}>
            <View style={styles.pulsingDot} />
            <Text style={styles.statusPillText}>
              {country === 'US' ? 'Live GPS • Miami / US Hub' : 'GPS ao Vivo • São Paulo / BR'}
            </Text>
          </View>
        </View>

        {/* Marcador Simulado do Carro MOVY em Alta Resolução */}
        <View style={styles.carMarker}>
          <Text style={styles.carMarkerIcon}>🚗</Text>
        </View>
      </View>

      {/* Painel Inferior (Bottom Sheet com Cantos Arredondados e Design MOVY) */}
      <View style={styles.bottomSheet}>
        {!activeTrip ? (
          <>
            {/* Barra de Busca "Where to? / Para onde vamos?" */}
            <TouchableOpacity style={styles.searchBar}>
              <Text style={styles.searchIcon}>📍</Text>
              <Text style={styles.searchText}>
                {country === 'US' ? 'Where to in the United States?' : 'Para onde vamos hoje?'}
              </Text>
            </TouchableOpacity>

            {/* Categorias de Corrida */}
            <Text style={styles.sectionTitle}>
              {country === 'US' ? 'Select MOVY Ride' : 'Escolha sua Categoria'}
            </Text>
            <View style={styles.categoriesRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const price = country === 'US' ? cat.priceUSD : cat.priceBRL;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryCard, isSelected && styles.categoryCardActive]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={[styles.categoryName, isSelected && styles.categoryNameActive]}>
                      {cat.name}
                    </Text>
                    <Text style={styles.categoryEta}>{cat.eta}</Text>
                    <Text style={[styles.categoryPrice, isSelected && styles.categoryPriceActive]}>
                      {currency} {price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Botões de Ação: Padrão e MOVY Negocia */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => handleRequestRide(false)}
              >
                <Text style={styles.requestButtonText}>
                  {country === 'US' ? 'Request Ride' : 'Pedir Corrida'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.negociaButton}
                onPress={() => handleRequestRide(true)}
              >
                <Text style={styles.negociaButtonText}>MOVY NEGOCIA</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* Card da Corrida Ativa com PIN de Segurança */
          <View style={styles.activeTripCard}>
            <View style={styles.driverRow}>
              <View style={styles.driverAvatar}>
                <Text style={styles.avatarLetter}>C</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{activeTrip.driverName} ★ {activeTrip.rating}</Text>
                <Text style={styles.vehicleText}>{activeTrip.vehicle}</Text>
                <Text style={styles.etaText}>
                  {country === 'US' ? `Arriving in ${activeTrip.etaArrival}` : `Chegando em ${activeTrip.etaArrival}`}
                </Text>
              </View>
            </View>

            {/* CAIXA DE SEGURANÇA: PIN DE 4 DÍGITOS PARA EMBARQUE */}
            <View style={styles.pinSecurityBox}>
              <Text style={styles.pinLabel}>
                {country === 'US' ? 'SECURITY PIN FOR BOARDING' : 'PIN DE SEGURANÇA PARA EMBARQUE'}
              </Text>
              <Text style={styles.pinCodeNumber}>{activeTrip.pin_code}</Text>
              <Text style={styles.pinSubtext}>
                {country === 'US' 
                  ? 'Tell this PIN to driver before vehicle starts moving' 
                  : 'Informe este código ao motorista para iniciar a viagem'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.cancelTripButton}
              onPress={() => setActiveTrip(null)}
            >
              <Text style={styles.cancelTripButtonText}>
                {country === 'US' ? 'Cancel Ride' : 'Cancelar Corrida'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOVY_THEME.colors.background,
  },
  mapMock: {
    flex: 1,
    backgroundColor: '#0A0E1D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayTop: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 10, 26, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: MOVY_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MOVY_THEME.colors.primary,
    marginRight: 8,
  },
  statusPillText: {
    color: MOVY_THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  carMarker: {
    padding: 10,
    backgroundColor: MOVY_THEME.colors.surface,
    borderRadius: MOVY_THEME.borderRadius.full,
    borderWidth: 2,
    borderColor: MOVY_THEME.colors.primary,
  },
  carMarkerIcon: {
    fontSize: 22,
  },
  bottomSheet: {
    backgroundColor: MOVY_THEME.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MOVY_THEME.colors.surfaceElevated,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchText: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  sectionTitle: {
    color: MOVY_THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryCard: {
    width: (width - 64) / 4,
    backgroundColor: MOVY_THEME.colors.surfaceElevated,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.border,
  },
  categoryCardActive: {
    borderColor: MOVY_THEME.colors.primary,
    backgroundColor: 'rgba(4, 243, 250, 0.08)',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryNameActive: {
    color: MOVY_THEME.colors.textPrimary,
  },
  categoryEta: {
    color: MOVY_THEME.colors.textMuted,
    fontSize: 9,
    marginBottom: 4,
  },
  categoryPrice: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  categoryPriceActive: {
    color: MOVY_THEME.colors.primary,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestButton: {
    flex: 1.2,
    backgroundColor: MOVY_THEME.colors.primary,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 10,
  },
  requestButtonText: {
    color: MOVY_THEME.colors.background,
    fontSize: 15,
    fontWeight: '800',
  },
  negociaButton: {
    flex: 1,
    backgroundColor: MOVY_THEME.colors.brandBlue,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  negociaButtonText: {
    color: MOVY_THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activeTripCard: {
    paddingVertical: 8,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: MOVY_THEME.colors.brandBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLetter: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    color: MOVY_THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  vehicleText: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  etaText: {
    color: MOVY_THEME.colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  pinSecurityBox: {
    backgroundColor: 'rgba(4, 243, 250, 0.1)',
    borderColor: MOVY_THEME.colors.primary,
    borderWidth: 1,
    borderRadius: MOVY_THEME.borderRadius.md,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  pinLabel: {
    color: MOVY_THEME.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pinCodeNumber: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 8,
    marginVertical: 4,
  },
  pinSubtext: {
    color: MOVY_THEME.colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  cancelTripButton: {
    borderColor: MOVY_THEME.colors.danger,
    borderWidth: 1,
    borderRadius: MOVY_THEME.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelTripButtonText: {
    color: MOVY_THEME.colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
});
