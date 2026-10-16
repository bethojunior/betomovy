import { useState } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../../../client/locales';
import { useAuth } from '../../../../context/auth';
import { TripChatHeader } from '../../../../common/components/TripChatHeader';
import { RatingTripsLine } from '../../../../common/components/RatingTripsLine';
import { TripChatDetailsSheet } from '../../../../common/components/TripChatDetailsSheet';
import { PartnerCard } from '../../../../common/components/TripDetail/PartnerCard';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { buildApp } from '../../../../constantBuild/config';
import { dismissKeyboardAndWait } from '../../../../common/Utils/dismissKeyboardAndWait';
import type { DriverTripChatTrip } from './types';

export function NavBar({ trip }: { trip: DriverTripChatTrip }) {
  const navigation = useNavigation();
  const { cityConfig } = useAuth();
  const { getStoragePictureSpecific } = useStoragePictures();
  const customer = trip?.customer;
  const [detailsVisible, setDetailsVisible] = useState(false);
  const customerPhotoUrl = customer?.profileImage
    ? (getStoragePictureSpecific('customer') || buildApp().HOST_IMAGE_CUSTOMER) + customer.profileImage
    : undefined;

  return (
    <>
      <TripChatHeader
        photoUrl={customerPhotoUrl}
        photoAccessibilityLabel={customer?.name}
        label={translate('myTravels.passenger')}
        title={customer?.name ?? customer?.nickname ?? ''}
        onGoBack={() => { dismissKeyboardAndWait().then(() => navigation.navigate('Home', { visible: true })); }}
        goBackAccessibilityLabel={translate('trip.chat.go_back_a11y')}
        onCallPress={
          cityConfig?.enableCallInChat !== '0'
            ? () => Linking.openURL(`tel:${customer?.phone}`)
            : undefined
        }
        callAccessibilityLabel={translate('trip.chat.call_a11y')}
        onPress={() => setDetailsVisible(true)}
      >
        <RatingTripsLine
          rating={customer?.rating}
          tripsCount={customer?.quantityTrips}
          tripsCountLabel={translate('myTravels.trips_count')}
        />
      </TripChatHeader>

      <TripChatDetailsSheet visible={detailsVisible} onClose={() => setDetailsVisible(false)}>
        <PartnerCard
          label={translate('myTravels.passenger')}
          name={customer?.name ?? customer?.nickname ?? ''}
          photoUrl={customerPhotoUrl}
          rating={customer?.rating}
          tripsCount={customer?.quantityTrips}
          tripsCountLabel={translate('myTravels.trips_count')}
        />
      </TripChatDetailsSheet>
    </>
  );
}
