import {View} from 'react-native';
import * as Location from 'expo-location';
import {GestureDetector} from 'react-native-gesture-handler';
import {useTheme} from 'styled-components/native';
import ListPublicity from '~/components/ListPublicity';
import {DestinationSearchBar} from '../../../../../components/DestinationSearchBar';
import {Mylocation} from '../../../../../components/MyLocation';
import {HistoryOfPlaces} from '../../../../../components/Places';
import {useHomeSheetDrag} from '../../../../../hooks/useHomeSheetDrag';
import {ModuleGrid} from '../ModuleGrid';
import {
  ContentAddress,
  ContentScroll,
  DetailsContent,
  Handle,
  HandleArea,
  MyLocationViewer,
  PublicityWrapper,
} from './styles';
import {HomeBottomSheetProps} from './types';

export function HomeBottomSheet({
  mapRef,
  position,
  onPositionChange,
  searchPlaceholder,
  onSearchPress,
  onMicPress,
  moduleButtons,
  onModulePress,
  publicityList,
}: HomeBottomSheetProps) {
  const {colors} = useTheme();
  const {isCompact, dragGesture} = useHomeSheetDrag();

  const handleMyLocationPress = async () => {
    const location = await Location.getCurrentPositionAsync({accuracy: 1});
    onPositionChange({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    if (position) {
      mapRef?.current?.animateToRegion({
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.001,
      });
    }
  };

  return (
    <DetailsContent>
      <GestureDetector gesture={dragGesture}>
        <HandleArea>
          <Handle />
        </HandleArea>
      </GestureDetector>

      <MyLocationViewer
        backgroundColor={colors.primary}
        onPress={handleMyLocationPress}
        activeOpacity={0.8}
      >
        <Mylocation onPress={() => true} />
      </MyLocationViewer>

      <ContentScroll>
        <View>
          <View>
            <ContentAddress>
              <DestinationSearchBar
                placeholder={searchPlaceholder}
                onSearchPress={onSearchPress}
                onMicPress={onMicPress}
              />
            </ContentAddress>
          </View>
        </View>

        {!isCompact && (
          <View>
            <HistoryOfPlaces currentPosition={position} />

            {moduleButtons.length > 0 && (
              <ModuleGrid modules={moduleButtons} onModulePress={onModulePress} />
            )}

            {publicityList.length > 0 && (
              <PublicityWrapper>
                <ListPublicity data={publicityList} spacing={25} paddingBottom={0} />
              </PublicityWrapper>
            )}
          </View>
        )}
      </ContentScroll>
    </DetailsContent>
  );
}
