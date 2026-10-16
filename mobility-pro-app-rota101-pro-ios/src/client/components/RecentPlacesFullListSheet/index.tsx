import {BottomSheetModal} from '../BottomSheetModal';
import {RecentPlaceCard} from '../RecentPlaceCard';
import {translate} from '../../locales';
import {EmptyText, List, ListCard, Title} from './styles';
import {RecentPlacesFullListSheetProps} from './types';

export function RecentPlacesFullListSheet({
  visible,
  places,
  getDistanceLabel,
  onRequestClose,
  onSelectPlace,
  onOptionsPress,
}: RecentPlacesFullListSheetProps) {
  return (
    <BottomSheetModal visible={visible} onRequestClose={onRequestClose}>
      <Title>{translate('home.text_recent_places')}</Title>

      {places.length === 0 && (
        <EmptyText>{translate('home.text_no_recent_places')}</EmptyText>
      )}

      <ListCard>
        <List showsVerticalScrollIndicator={false}>
          {places.map((place, index) => (
            <RecentPlaceCard
              key={place.address}
              place={place}
              distanceLabel={getDistanceLabel(place)}
              hasBorder={index !== places.length - 1}
              onPress={() => onSelectPlace(place)}
              onOptionsPress={() => onOptionsPress(place)}
            />
          ))}
        </List>
      </ListCard>
    </BottomSheetModal>
  );
}
