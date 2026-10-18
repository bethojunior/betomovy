import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n } from '../../i18n';
import { MovyApiService } from '../../services/api';

interface ScheduledTripsScreenProps {
  onBack: () => void;
}

export const ScheduledTripsScreen: React.FC<ScheduledTripsScreenProps> = ({ onBack }) => {
  const country = i18n.getCountry();
  const currency = country === 'US' ? '$' : 'R$';

  const [origin, setOrigin] = useState(
    country === 'US' ? '4441 Collins Ave, Miami Beach' : 'Av. Brigadeiro Faria Lima, 2000'
  );
  const [destination, setDestination] = useState(
    country === 'US' ? 'Miami International Airport (MIA)' : 'Aeroporto de Guarulhos (GRU)'
  );
  const [scheduledTime, setScheduledTime] = useState('Tomorrow at 06:30 AM');

  const [scheduledRides, setScheduledRides] = useState<any[]>([
    {
      id: 'SCHED-01',
      date: 'Oct 20, 2026 • 06:30 AM',
      origin: country === 'US' ? 'Fontainebleau Miami Beach' : 'Hotel Emiliano - Jardins',
      destination: country === 'US' ? 'MIA Airport Concourse D' : 'Aeroporto de Guarulhos',
      fare: country === 'US' ? 48.0 : 95.0,
      driverStatus: country === 'US' ? 'Driver Dispatched 20m before' : 'Motorista confirmado',
    },
  ]);

  const handleCreateSchedule = async () => {
    try {
      await MovyApiService.createScheduledTrip({
        passenger_id: 1,
        scheduled_for: new Date(Date.now() + 86400000).toISOString(),
        origin_address: origin,
        origin_lat: 25.8175,
        origin_lng: -80.1223,
        destination_address: destination,
        destination_lat: 25.7959,
        destination_lng: -80.2870,
        category: 'comfort',
        currency: country === 'US' ? 'USD' : 'BRL',
      });

      const newRide = {
        id: 'SCHED-' + Math.floor(100 + Math.random() * 900),
        date: scheduledTime,
        origin,
        destination,
        fare: country === 'US' ? 38.5 : 75.0,
        driverStatus: country === 'US' ? 'Looking for driver' : 'Buscando motorista',
      };

      setScheduledRides((prev) => [newRide, ...prev]);
      Alert.alert(
        country === 'US' ? 'Ride Scheduled!' : 'Viagem Agendada!',
        country === 'US'
          ? 'Your driver will arrive on time tomorrow morning.'
          : 'Sua corrida foi agendada com sucesso.'
      );
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao agendar corrida.');
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
          {country === 'US' ? 'Reserve a Ride in Advance' : 'Corridas Agendadas'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Formulário de Agendamento */}
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>
            {country === 'US' ? 'SCHEDULE A PICKUP' : 'AGENDAR EMBARQUE'}
          </Text>

          <Text style={styles.inputLabel}>{country === 'US' ? 'PICKUP ADDRESS' : 'ORIGEM'}</Text>
          <TextInput
            style={styles.textInput}
            value={origin}
            onChangeText={setOrigin}
            placeholderTextColor="#64748B"
          />

          <Text style={styles.inputLabel}>{country === 'US' ? 'DESTINATION' : 'DESTINO'}</Text>
          <TextInput
            style={styles.textInput}
            value={destination}
            onChangeText={setDestination}
            placeholderTextColor="#64748B"
          />

          <Text style={styles.inputLabel}>{country === 'US' ? 'DATE & TIME' : 'DATA E HORÁRIO'}</Text>
          <TextInput
            style={styles.textInput}
            value={scheduledTime}
            onChangeText={setScheduledTime}
            placeholderTextColor="#64748B"
          />

          <TouchableOpacity style={styles.scheduleButton} onPress={handleCreateSchedule}>
            <Text style={styles.scheduleButtonText}>
              📅 {country === 'US' ? 'CONFIRM RESERVATION' : 'CONFIRMAR AGENDAMENTO'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Viagens Já Agendadas */}
        <Text style={styles.sectionTitle}>
          {country === 'US' ? 'Your Upcoming Reservations' : 'Seus Próximos Agendamentos'}
        </Text>

        {scheduledRides.map((ride) => (
          <View key={ride.id} style={styles.rideCard}>
            <View style={styles.rideHeader}>
              <Text style={styles.rideDate}>📅 {ride.date}</Text>
              <Text style={styles.rideFare}>
                {currency} {Number(ride.fare).toFixed(2)}
              </Text>
            </View>

            <Text style={styles.routeText}>📍 {ride.origin}</Text>
            <Text style={styles.routeText}>🏁 {ride.destination}</Text>

            <View style={styles.statusFooter}>
              <Text style={styles.driverStatusText}>🛡️ {ride.driverStatus}</Text>
            </View>
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
  formCard: {
    backgroundColor: '#0F1426',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 24,
  },
  cardTitle: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 16,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#070A1A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  scheduleButton: {
    backgroundColor: MOVY_THEME.colors.brandBlue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  scheduleButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionTitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 14,
  },
  rideCard: {
    backgroundColor: '#0F1426',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rideDate: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 13,
    fontWeight: '800',
  },
  rideFare: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  routeText: {
    color: '#CBD5E1',
    fontSize: 13,
    marginTop: 4,
  },
  statusFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#1E293B',
  },
  driverStatusText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
});
