import Icon from '@expo/vector-icons/FontAwesome5';
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTrip } from '../../contexts/Trip';
import LottieView from 'lottie-react-native';
import {
  STATUS_BACK_OFF,
  STATUS_SCHEDULED,
  STATUS_SEARCHING_FAVORITE,
  STATUS_SEARCHING,
} from '../../constants/trip';
import {
  ButtonCancel,
  CenterContentContainer,
  Header,
  HeaderTitle,
  IconContainer,
  TextCancel,
  GoBackButton,
} from './styles';
import { customToast } from '../../../utils/FlashMessage';
import { translate } from '../../locales';
import { ContainerDot } from '../ModalOfferTrip/styles';
import Helper from '../../utils/Helper';
import { If } from '../If';
import { convertDatetimeToTime } from '../../utils/FormatDate';
import { AlertRecording } from '../../../common/AlertRecording';
import { useAuth } from '../../../context/auth';
import { useTheme } from 'styled-components';

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

  const {
    origin,
    destination,
    text,
    loadingTrip,
    trip,
    tripPartnerList
  } = stateTripCustomer;
  const tripPartner = tripPartnerList[tripPartnerList?.length - 1]

  const { generalSettings, userData } = useAuth();

  const [loadingSegundAnimation, setLoadingSegundAnimation] = useState(false);
  const [isBigger, setIsBigger] = useState(false)

  const { colors } = useTheme();

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
        setIsBigger(!(Number(el.value) <= userData.quantityTrips))
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
      {
        isBigger && trip.status === STATUS_SEARCHING ||
          isBigger && trip.status === STATUS_SEARCHING_FAVORITE
          ? (
            <AlertRecording />
          ) : null}
      <Animated.View
        style={[
          {
            width: '100%',
            height: 260,
            alignItems: 'center',
            borderRadius: 25,
            backgroundColor: colors.background_global,
          },
          animatedContainer,
        ]}
      >
        <Header>
          <If condition={trip.status === STATUS_SCHEDULED}>
            <GoBackButton
              onPress={() => {
                clearTrip();
              }}
            >
              <Icon name="arrow-left" size={RFValue(20)} />
            </GoBackButton>
          </If>

          <HeaderTitle>{switchTitleCase(trip?.status)}</HeaderTitle>
          <If condition={!loadingTrip && !loadingSegundAnimation}>
            <ContainerDot>
              <LottieView
                autoPlay
                style={{
                  width: '100%',
                }}
                source={require('../../assets/animation/loading-line.json')}
              />
            </ContainerDot>
          </If>
          <If condition={loadingSegundAnimation}>
            <ContainerDot>
              <LottieView
                autoPlay
                style={{
                  width: '100%',
                }}
                source={require('../../assets/animation/loading-line.json')}
              />
            </ContainerDot>
          </If>
        </Header>
        <CenterContentContainer>
          <IconContainer>
            <If condition={loadingSegundAnimation}>
              <LottieView
                autoPlay
                style={{
                  width: RFValue(150),
                  height: RFValue(150),
                }}
                source={require('../../assets/animation/planet-animation.json')}
              />
            </If>
            <If condition={!loadingSegundAnimation}>
              <LottieView
                source={require('../../assets/animation/car-running-animation.json')}
                style={[{ width: RFValue(150), height: RFValue(150) }]}
                autoPlay
                loop
              />
            </If>
          </IconContainer>
        </CenterContentContainer>
        <If condition={!loadingTrip}>
          <ButtonCancel
            onPress={async () => {
              Alert.alert(
                translate('trip.cancel_trip'),
                translate('trip.text_dialog_cancel'),
                [
                  {
                    text: translate('trip.acccept'),
                    onPress: async () => {
                      await cancelTripByCustomer(
                        null,
                        STATUS_BACK_OFF,
                        trip.tripReference ||
                        tripPartner.tripReference
                      );
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
        </If>
      </Animated.View>
    </>
  );
}
