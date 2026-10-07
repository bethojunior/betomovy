import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { translate } from '../../../../client/locales';
import { CardOffer } from '../../components/CardOffer';
import { useTripProvider } from '../../context/Trip';
import { Container, WithoutTripText } from './style';
import { useTripsOffer } from '../../hooks/useTripsOffer';
import { Trip } from '../../../../interfaces/trip';
import { ActivityIndicator, FlatList, ListRenderItem, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { TripRefusedService } from '../../service/api/TripRefusedService';
import { useUserDriver } from '../../context/userDriver';
import { customToast } from '~/utils/FlashMessage';

export default function TripsOffer() {
  const { acceptTripOffer, stateTrip, decrementTripSummaryItem } = useTripProvider((context) => context);
  const { goBack } = useNavigation();
  const [isInitialLoadComplete, setInitialLoadComplete] = useState(false);

  const { tripSummary } = stateTrip;

  const {
    data,
    isLoading,
    isRefreshing,
    isFetchingNextPage,
    refresh,
    fetchNextPage,
    update,
  } = useTripsOffer();

  const { userDriverFind: { idDriver } } = useUserDriver();

  const theme = useTheme();

  const acceptTrip = async (tripReference: string) => {
    await acceptTripOffer(tripReference);
    goBack();
  };

  const refuseOffer = async (idTrip: string) => {
    if (!idTrip || !idDriver) return;

    try {
      const { status, message } = await TripRefusedService.create(idDriver, idTrip);
      if (status) {
        removeItemTripBid(idTrip);
        decrementTripSummaryItem('totalOfferTrips', 1);

        customToast(translate("tripDriver.text_trip_declined_success"), 'success');
      } else {
        customToast(message, 'error');
      }
    } catch (error) {
      customToast(translate("tripDriver.text_decline_offer_error"), "error");
    }
  };

  const removeItemTripBid = async (idTrip: string) => {
    const trips = data.filter(item => item.idTrip != idTrip);
    update(trips);
  };

  const renderItem: ListRenderItem<Trip> = useCallback(
    ({ item }) => (
      <CardOffer
        onPressAccept={acceptTrip}
        onPressRefuse={refuseOffer}
        trip={item}
      />
    ), []);

  const renderFooter = () =>
    isFetchingNextPage ? (
      <View style={{ paddingVertical: theme.spacing.large }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    ) : null;

  const EmptyList = () =>
    !isRefreshing && !isLoading && data.length === 0 ? (
      <WithoutTripText>
        {translate('tripDriver.there_are_no_trips_available')}
      </WithoutTripText>
    ) : null;

  useEffect(() => {
    setInitialLoadComplete(true);
  }, []);

  useEffect(() => {
    if (isInitialLoadComplete && tripSummary.totalOfferTrips === 0) {
      goBack();
    }
  }, [tripSummary.totalOfferTrips, isInitialLoadComplete, goBack]);

  return (
    <Container>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.large }}
        ListEmptyComponent={EmptyList}
        keyExtractor={(item) => item.idTrip}
        data={data}
        renderItem={renderItem}
        refreshing={isRefreshing || isLoading}
        onRefresh={refresh}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
      />
    </Container>
  );
}
