import Icon from '@expo/vector-icons/FontAwesome5';
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTrip } from '../../contexts/Trip';
import {
  STATUS_BACK_OFF,
  STATUS_SCHEDULED,
  STATUS_SEARCHING,
} from '../../constants/trip';
import {
  ButtonCancel,
  CenterContentContainer,
  Container,
  Handle,
  Header,
  HeaderTitle,
  IconContainer,
  LoadingLineAnimation,
  StatusAnimation,
  TextCancel,
  GoBackButton,
} from './styles';
import { customToast } from '../../../utils/FlashMessage';
import { translate } from '../../locales';
import { ContainerDot } from '../ModalOfferTrip/styles';
import Helper from '../../utils/Helper';
import { convertDatetimeToTime } from '../../utils/FormatDate';
import { AlertRecording } from '../../../common/AlertRecording';
import { useAuth } from '../../../context/auth';

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
} from 'react-native-reanimated';

export default function DriverSearch() {
  const {
    cancelTripByCustomer,
    clearTrip,
    stateTripCustomer,
    dispatchTripCustomer,
  } = useTrip();

  const { origin, destination, text, loadingTrip, trip, tripPartnerList } =
    stateTripCustomer;
  const tripPartner = tripPartnerList[tripPartnerList?.length - 1];

  const { generalSettings, userData } = useAuth();

  const [loadingSegundAnimation, setLoadingSegundAnimation] = useState(false);
  const [isBigger, setIsBigger] = useState(false);

  const opacityValue = useSharedValue(0);
  const valueTranslateY = useSharedValue(150);

  const animatedContainer = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: valueTranslateY.value }],
      opacity: opacityValue.value,
    };
  });

  useEffect(() => {
    opacityValue.value = withSequence(
      withTiming(0, { duration: 200 }),
      withTiming(1, { duration: 200 }),
    );

    valueTranslateY.value = withSequence(
      withTiming(150, { duration: 200 }),
      withTiming(0, { duration: 200 }),
    );
  }, []);

  useEffect(() => {
    Helper.timeout(2000).then(() => {
      setLoadingSegundAnimation(true);
    });

    generalSettings?.find(el => {
      if (
        el.key === 'how_many_times_alert_will_be_shown' &&
        Number(el.value) > 3
      ) {
        setIsBigger(!(Number(el.value) <= userData.quantityTrips));
      }
    });
  }, []);

  const switchTitleCase = status => {
    switch (status) {
      case 'scheduled':
        return (
          translate('trip.status_search_scheduled') +
          convertDatetimeToTime(trip?.schedule['schedule']) || ''
        );
      default:
        return !loadingTrip ? translate('trip.status_search_find') : text;
    }
  };

  return (
    <>
      {isBigger && trip.status === STATUS_SEARCHING ? (
        <AlertRecording />
      ) : null}
      <Container style={animatedContainer}>
        <Handle />
        <Header>
          {trip.status === STATUS_SCHEDULED && (
            <GoBackButton onPress={clearTrip}>
              <Icon name="arrow-left" size={RFValue(20)} />
            </GoBackButton>
          )}

          <HeaderTitle>{switchTitleCase(trip?.status)}</HeaderTitle>

          {!loadingSegundAnimation ? (
            !loadingTrip && (
              <ContainerDot>
                <LoadingLineAnimation
                  autoPlay
                  source={require('../../assets/animation/loading-line.json')}
                />
              </ContainerDot>
            )
          ) : (
            <ContainerDot>
              <LoadingLineAnimation
                autoPlay
                source={require('../../assets/animation/loading-line.json')}
              />
            </ContainerDot>
          )}
        </Header>
        <CenterContentContainer>
          <IconContainer>
            {loadingSegundAnimation ? (
              <StatusAnimation
                autoPlay
                source={require('../../assets/animation/planet-animation.json')}
              />
            ) : (
              <StatusAnimation
                autoPlay
                loop
                source={require('../../assets/animation/car-running-animation.json')}
              />
            )}
          </IconContainer>
        </CenterContentContainer>
        <ButtonCancel
          onPress={async () => {
            Alert.alert(
              translate('trip.cancel_trip'),
              translate('trip.text_dialog_cancel'),
              [
                {
                  text: translate('trip.acccept'),
                  onPress: async () => {
                    const canceled = await cancelTripByCustomer(
                      null,
                      STATUS_BACK_OFF,
                      trip.tripReference || tripPartner.tripReference,
                    );
                    if (!canceled) return;

                    customToast(
                      translate('trip.your_trip_has_been_canceled'),
                      'success',
                    );
                    dispatchTripCustomer({
                      type: 'update',
                      field: 'origin',
                      arg: origin,
                    });
                    dispatchTripCustomer({
                      type: 'update',
                      field: 'destination',
                      arg: destination,
                    });
                  },
                },

                {
                  text: translate('trip.recuse'),
                  onPress: () => {
                    console.log('Cancel Pressed');
                  },
                },
              ],
              { cancelable: false },
            );
          }}
        >
          <TextCancel>{translate('trip.cancel')}</TextCancel>
        </ButtonCancel>
      </Container>
    </>
  );
}
