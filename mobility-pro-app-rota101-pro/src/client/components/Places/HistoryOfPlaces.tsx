import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ObserverTypeEnum, Place, usePlaces} from '../../hooks/place';
import {useLocal} from '../../contexts/local';
import {formatDistanceFromCurrentPosition} from '../../utils/formatDistance';
import {RecentPlaceCard} from '../RecentPlaceCard';
import {RecentPlaceOptionsMenu} from '../RecentPlaceOptionsMenu';
import {RecentPlacesFullListSheet} from '../RecentPlacesFullListSheet';
import {translate} from '../../locales';
import {ListCard, PreviewList, SectionHeader, SectionTitle, SeeAllLink, SeeAllLinkText} from './styles';

const PREVIEW_LIMIT = 3;
const FULL_LIST_LIMIT = 20;

interface HistoryOfPlacesProps {
  currentPosition?: {latitude: number; longitude: number} | null;
}

export const HistoryOfPlaces = ({currentPosition}: HistoryOfPlacesProps) => {
  const {places, requestAllPlaces, removeByAddress, toggleFavorite, subscribe} =
    usePlaces();
  const {lastPlaceSelected, setLastPlaceSelected} = useLocal();
  const navigation = useNavigation();

  const [isFullListVisible, setIsFullListVisible] = useState(false);
  const [placeForMenu, setPlaceForMenu] = useState<Place | null>(null);

  useEffect(() => {
    requestAllPlaces();

    const unsubscribeRemoved = subscribe(ObserverTypeEnum.removed, () => {
      requestAllPlaces();
    });
    const unsubscribeUpdated = subscribe(ObserverTypeEnum.updated, () => {
      requestAllPlaces();
    });

    return () => {
      unsubscribeRemoved();
      unsubscribeUpdated();
    };
  }, [lastPlaceSelected]);

  if (!places.length) {
    return <></>;
  }

  const getDistanceLabel = (place: Place) => {
    if (!currentPosition) {
      return undefined;
    }

    return formatDistanceFromCurrentPosition(
      currentPosition.latitude,
      currentPosition.longitude,
      place.latitude,
      place.longitude,
    );
  };

  const selectPlace = (place: Place) => {
    setLastPlaceSelected({
      address: place.address,
      latitude: place.latitude,
      longitude: place.longitude,
      street: place.street || null,
      type: place.type || null,
    });
    navigation.navigate('TripRoutes', {screen: 'Trip'});
  };

  const openFullList = () => {
    requestAllPlaces(FULL_LIST_LIMIT);
    setIsFullListVisible(true);
  };

  const closeFullList = () => {
    requestAllPlaces(PREVIEW_LIMIT);
    setIsFullListVisible(false);
  };

  const previewPlaces = places.slice(0, PREVIEW_LIMIT);

  return (
    <>
      <ListCard>
        <SectionHeader>
          <SectionTitle>{translate('home.text_recent_places')}</SectionTitle>
          <SeeAllLink onPress={openFullList}>
            <SeeAllLinkText>{translate('home.text_see_all')}</SeeAllLinkText>
          </SeeAllLink>
        </SectionHeader>

        <PreviewList nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {previewPlaces.map((place, index) => (
            <RecentPlaceCard
              key={place.address}
              place={place}
              distanceLabel={getDistanceLabel(place)}
              hasBorder={index !== previewPlaces.length - 1}
              onPress={() => selectPlace(place)}
              onOptionsPress={() => setPlaceForMenu(place)}
            />
          ))}
        </PreviewList>
      </ListCard>

      <RecentPlaceOptionsMenu
        visible={!!placeForMenu}
        address={placeForMenu?.address ?? null}
        isFavorite={placeForMenu?.isFavorite}
        onRequestClose={() => setPlaceForMenu(null)}
        onToggleFavorite={() => {
          if (placeForMenu) toggleFavorite(placeForMenu.address);
        }}
        onDelete={() => {
          if (placeForMenu) removeByAddress(placeForMenu.address);
        }}
      />

      <RecentPlacesFullListSheet
        visible={isFullListVisible}
        places={places}
        getDistanceLabel={getDistanceLabel}
        onRequestClose={closeFullList}
        onSelectPlace={place => {
          closeFullList();
          selectPlace(place);
        }}
        onOptionsPress={place => setPlaceForMenu(place)}
      />
    </>
  );
};
