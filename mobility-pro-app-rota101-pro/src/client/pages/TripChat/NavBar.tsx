import { useState } from 'react';
import { Linking } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/auth';
import { useFavorite } from '../../contexts/favorite';
import { buildApp } from '../../../constantBuild/config';
import { useStoragePictures } from '../../../driver/src/hooks/useStoragePictures';
import { translate } from '../../locales';
import { TripChatHeader } from '../../../common/components/TripChatHeader';
import { TripChatDetailsSheet } from '../../../common/components/TripChatDetailsSheet';
import { PartnerCard } from '../../../common/components/TripDetail/PartnerCard';
import { IconInfoRow } from '../../../common/components/IconInfoRow';
import { dismissKeyboardAndWait } from '../../../common/Utils/dismissKeyboardAndWait';
import { RowText, PlateBadge, PlateBadgeText, FavoriteDivider, FavoriteButton, FavoriteButtonText } from './styles';
import { TripChatTrip } from './types';

// Adapter único do header do chat do cliente — usado pelas duas telas de chat
// (TripChat e TripChatView), que antes duplicavam essa função inline.
export function NavBar({ trip }: { trip: TripChatTrip }) {
  const navigation = useNavigation();
  const { cityConfig } = useAuth();
  const { getStoragePictureSpecific } = useStoragePictures();
  const [detailsVisible, setDetailsVisible] = useState(false);
  const driver = trip?.driver;

  const photoUrl = driver?.profileImage
    ? `${getStoragePictureSpecific('driver') || buildApp().HOST_IMAGE_DRIVER}${driver.profileImage}`
    : undefined;

  return (
    <>
      <TripChatHeader
        photoUrl={photoUrl}
        photoAccessibilityLabel={driver?.nickname ?? driver?.name}
        label={translate('myTravels.driver')}
        title={driver?.nickname ?? driver?.name ?? ''}
        onGoBack={() => { dismissKeyboardAndWait().then(() => navigation.goBack()); }}
        goBackAccessibilityLabel={translate('trip.chat.go_back_a11y')}
        onCallPress={
          cityConfig?.enableCallInChat !== '0'
            ? () => Linking.openURL(`tel:${driver?.phone}`)
            : undefined
        }
        callAccessibilityLabel={translate('trip.chat.call_a11y')}
        onPress={() => setDetailsVisible(true)}
      >
        <DriverCarSubtitle car={driver?.car} />
      </TripChatHeader>

      <DriverDetailsSheet
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        driver={driver}
        photoUrl={photoUrl}
      />
    </>
  );
}

function DriverCarSubtitle({ car }: { car?: TripChatTrip['driver']['car'] }) {
  if (!car || (!car.model && !car.plate)) return null;

  const modelAndColor = [car.model, car.color].filter(Boolean).join(' ');

  return (
    <>
      {!!modelAndColor && <RowText>{modelAndColor}</RowText>}
      {!!car.plate && (
        <PlateBadge>
          <PlateBadgeText>{car.plate}</PlateBadgeText>
        </PlateBadge>
      )}
    </>
  );
}

function DriverDetailsSheet({
  visible,
  onClose,
  driver,
  photoUrl,
}: {
  visible: boolean;
  onClose: () => void;
  driver: TripChatTrip['driver'];
  photoUrl?: string;
}) {
  const theme = useTheme();
  const { user } = useAuth();
  const { addFavorites, removeFavorites, getFavorites, favorites } = useFavorite();

  const favoriteRecord = favorites.find(
    item => String(item.idDriver) === String(driver?.idDriver),
  );
  const isFavorited = !!favoriteRecord;

  const toggleFavorite = async () => {
    if (!driver?.idDriver) return;
    if (isFavorited) {
      await removeFavorites(String(favoriteRecord.idFavorite));
    } else {
      await addFavorites(user?.idCustomer, Number(driver.idDriver));
    }
    await getFavorites();
  };

  const modelAndColor = [driver?.car?.model, driver?.car?.color].filter(Boolean).join(' ');

  return (
    <TripChatDetailsSheet visible={visible} onClose={onClose}>
      <PartnerCard
        label={translate('myTravels.driver')}
        name={driver?.nickname ?? driver?.name ?? ''}
        photoUrl={photoUrl}
        rating={driver?.driverRating}
      >
        {!!modelAndColor && (
          <IconInfoRow
            icon={color => <Ionicons name="car-sport-outline" size={RFValue(18)} color={color} />}
            label={translate('trip.chat.vehicle_label')}
            value={modelAndColor}
            variant="primary"
          />
        )}
        {!!driver?.car?.plate && (
          <IconInfoRow
            icon={color => <Ionicons name="pricetag-outline" size={RFValue(18)} color={color} />}
            label={translate('trip.chat.plate_label')}
            value={driver.car.plate}
            variant="primary"
            showDivider={false}
          />
        )}

        <FavoriteDivider />
        <FavoriteButton activeOpacity={0.7} onPress={toggleFavorite}>
          <FontAwesome5 name="heart" solid={isFavorited} size={RFValue(14)} color={theme.colors.red} />
          <FavoriteButtonText>
            {isFavorited
              ? translate('favorites.text_button_isfavorited')
              : translate('favorites.text_button_favorite')}
          </FavoriteButtonText>
        </FavoriteButton>
      </PartnerCard>
    </TripChatDetailsSheet>
  );
}
