import { ListRenderItem, View, ActivityIndicator, Animated } from 'react-native';
import { CardSchedule } from '../../components/CardSchedule';
import { ScheduleDateFilter } from '../../components/ScheduleDateFilter';
import { ScrollToTopButton } from '../../../../components/ScrollToTopButton';
import { ListEmptyData } from '../../../../components/ListEmptyData';
import { Container } from './styles';
import { translate } from '../../../../client/locales';
import { useCallback, useState } from 'react';
import { useTripsAvailable } from '../../hooks/useTripsAvailable';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { useTheme } from 'styled-components/native';
import { Trip } from '../../../../interfaces/trip';

const ACCEPT_TRIP_ACTION = 'acceptScheduled';

export default function ScheduleAvailable() {
  const [dateStart, setDateStart] = useState<string | null>(null);
  const [dateEnd, setDateEnd] = useState<string | null>(null);

  const { data, isLoading, isRefreshing, isFetchingNextPage, refresh, fetchNextPage } =
    useTripsAvailable(dateStart, dateEnd);

  const theme = useTheme();

  const { listRef, scrollY, handleScroll, scrollToTop, scrollEventThrottle } =
    useScrollToTop<Trip>();

  const renderItem: ListRenderItem<Trip> = useCallback(
    ({ item }) => <CardSchedule trip={item} onPress={ACCEPT_TRIP_ACTION} />,
    [],
  );

  const renderFooter = () =>
    isFetchingNextPage ? (
      <View style={{ paddingVertical: theme.spacing.large }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    ) : null;

  const EmptyList = () =>
    !isRefreshing && !isLoading && data.length === 0 ? (
      <ListEmptyData
        icon="event-available"
        title={translate('tripDriver.there_are_no_trips_available')}
      />
    ) : null;

  return (
    <Container>
      <Animated.FlatList
        ref={listRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingTop: 14 }}
        onScroll={handleScroll}
        scrollEventThrottle={scrollEventThrottle}
        ListHeaderComponent={
          <ScheduleDateFilter
            startDate={dateStart}
            endDate={dateEnd}
            onChange={(start, end) => {
              setDateStart(start);
              setDateEnd(end);
            }}
          />
        }
        ListEmptyComponent={EmptyList}
        keyExtractor={(item) => item.idTrip}
        data={data}
        renderItem={renderItem}
        refreshing={isRefreshing || isLoading}
        onRefresh={refresh}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      />
      <ScrollToTopButton scrollY={scrollY} onPress={scrollToTop} />
    </Container>
  );
}
