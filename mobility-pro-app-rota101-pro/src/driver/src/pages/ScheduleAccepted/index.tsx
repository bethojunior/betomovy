import { ActivityIndicator, ListRenderItem, Animated } from 'react-native';
import { translate } from '../../../../client/locales';
import { CardSchedule } from '../../components/CardSchedule';
import { ScheduleDateFilter } from '../../components/ScheduleDateFilter';
import { ScrollToTopButton } from '../../../../components/ScrollToTopButton';
import { ListEmptyData } from '../../../../components/ListEmptyData';
import { Container } from './styles';
import { useTripsAccepted } from '../../hooks/useTripsAccepted';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { useTheme } from 'styled-components/native';
import { Trip } from '../../../../interfaces/trip';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

export default function ScheduleAccepted() {
  const [dateStart, setDateStart] = useState<string | null>(null);
  const [dateEnd, setDateEnd] = useState<string | null>(null);

  const { data, isLoading, isRefreshing, isFetchingNextPage, refresh, fetchNextPage } =
    useTripsAccepted(dateStart, dateEnd);

  const theme = useTheme();

  const { listRef, scrollY, handleScroll, scrollToTop, scrollEventThrottle } =
    useScrollToTop<Trip>();

  const renderItem: ListRenderItem<Trip> = useCallback(
    ({ item }) => <CardSchedule trip={item} />,
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
        contentContainerStyle={{ padding: theme.spacing.large }}
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
        removeClippedSubviews={false}
      />
      <ScrollToTopButton scrollY={scrollY} onPress={scrollToTop} />
    </Container>
  );
}
