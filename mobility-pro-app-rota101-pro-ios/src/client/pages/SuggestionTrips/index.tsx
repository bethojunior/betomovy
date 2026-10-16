import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translate } from '../../locales';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';

import {
  Container,
  Content,
  TitleText,
  SubtitleText,
  OptionsCountText,
  TravelOptionsList,
  CloseIconButton,
  NewChargeNoticeCard,
  NewChargeNoticeText,
  NewChargeNoticeTextBold,
} from './styles';

import { TripTypeCard } from '../../../components/TripTypeCard';
import { ConfirmButton } from '../../../components/ConfirmButton';

import { useTrip } from '../../contexts/Trip';
import { useSuggestionTrips } from './useSuggestionTrips';
import { SuggestionService } from '~/interfaces/suggestionTrip';
import { AppParamList } from '../../routes/types';
import Preload from '~/components/Preload';
import { CREDIT_CARD_APP, PIX_WEB } from '../../constants/paymentFormType';
import { useTheme } from 'styled-components/native';

const SUGGESTION_STORAGE_KEYS = {
  listServices: '@App:listServices',
  lastServices: '@App:lastServices',
  isPriceTurbined: '@App:isPriceTurbined',
  newTripObject: '@App:objectNewTrip',
  showAgainSuggestion: '@App:showAgainSuggestion',
} as const;

export default function SuggestionTrips() {
  const { dispatchTripCustomer, stateTripCustomer, newTrip, clearTrip } = useTrip();
  const { selectedOptionTravel, selectedPaymentMethod } = stateTripCustomer;

  const { services, lastService, loading, isTurbine } = useSuggestionTrips();

  const [showBtn, setShowBtn] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const navigation = useNavigation<NavigationProp<AppParamList>>();
  const theme = useTheme();

  const paymentFormTypeId = Number(selectedPaymentMethod?.paymentFormTypeId);
  const isPix = paymentFormTypeId === PIX_WEB;
  const isCard = paymentFormTypeId === CREDIT_CARD_APP;
  const showNewChargeNotice = isPix || isCard;

  useFocusEffect(
    useCallback(() => {
      setShowBtn(false);
      dispatchTripCustomer({ type: 'update', field: 'selectedOptionTravel', arg: {} });
    }, []),
  );

  const filteredServices = useMemo(() => {
    return services.filter((data) => data.tripTypeId !== lastService?.tripTypeId);
  }, [services, lastService?.tripTypeId]);

  const handleCloseModal = async () => {
    setShowBtn(false);
    clearTrip();
    navigation.navigate('TripRoutes', {
      screen: 'Home',
      params: { noUnsubscribe: true, pixCacheAction: 'cancel' },
    });
    await AsyncStorage.multiRemove(Object.values(SUGGESTION_STORAGE_KEYS));
  };

  const handleSelectTravel = (data: SuggestionService) => {
    setShowBtn(true);
    dispatchTripCustomer({
      type: 'update',
      field: 'selectedOptionTravel',
      arg: data,
    });
  };

  const confirmTrip = async () => {
    setConfirming(true);
    try {
      const rawTripObject = JSON.parse(
        (await AsyncStorage.getItem(SUGGESTION_STORAGE_KEYS.newTripObject)) ?? '{}',
      );

      const tripPrice = isTurbine
        ? selectedOptionTravel.turbinedPrice
        : selectedOptionTravel.price;

      await newTrip('', Number(tripPrice), isTurbine, undefined, {
        origin: rawTripObject.origin,
        destination: rawTripObject.destination,
        waypoints: rawTripObject.waypoints,
        tolls: rawTripObject.tolls,
      });

      await AsyncStorage.multiSet([
        [SUGGESTION_STORAGE_KEYS.showAgainSuggestion, JSON.stringify('true')],
        [SUGGESTION_STORAGE_KEYS.lastServices, JSON.stringify(selectedOptionTravel)],
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setConfirming(false);
    }
  };

  const handleConfirmTrip = async () => {
    if (isPix) {
      navigation.navigate('TripRoutes', {
        screen: 'TripPixPayment',
        params: {
          origin: 'TravelOptions',
          turbined: isTurbine,
        },
      });
      return;
    }

    await confirmTrip();
  };

  const optionsCountLabel =
    filteredServices.length === 1
      ? translate('modalSuggestionTrip.text_option_found_singular', {
          count: filteredServices.length,
        })
      : translate('modalSuggestionTrip.text_options_found_plural', {
          count: filteredServices.length,
        });

  return (
    <Container>
      <Preload visible={loading} />
      {!loading && (
        <Content>
          <CloseIconButton
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={handleCloseModal}
          >
            <Feather name="arrow-left" size={RFValue(24)} />
          </CloseIconButton>

          <TitleText>{translate('modalSuggestionTrip.title_modal')}</TitleText>
          <SubtitleText>
            {translate('modalSuggestionTrip.text_not_found_driver')}{' '}
            <SubtitleText bold>
              {lastService?.priceName?.toLocaleUpperCase()}{' '}
            </SubtitleText>
            {translate('modalSuggestionTrip.text_available')}.{' '}
            {translate('modalSuggestionTrip.text_suggestion_above')}
          </SubtitleText>

          <OptionsCountText>{optionsCountLabel}</OptionsCountText>

          <TravelOptionsList
            data={filteredServices}
            keyExtractor={(value) => String(value.tripTypeId)}
            renderItem={({ item: value }) => (
              <TripTypeCard
                name={value.priceName}
                price={String(isTurbine ? value.turbinedPrice : value.price)}
                pictureUrl={value.picture}
                turbine={isTurbine}
                selected={
                  Number(value.tripTypeId) === Number(selectedOptionTravel?.tripTypeId)
                }
                onPress={() => handleSelectTravel(value)}
              />
            )}
          />

          {showNewChargeNotice && (
            <NewChargeNoticeCard>
              <NewChargeNoticeText>
                <NewChargeNoticeTextBold>
                  {translate('modalSuggestionTrip.text_new_charge_notice_title')}
                </NewChargeNoticeTextBold>
                {translate('modalSuggestionTrip.text_new_charge_notice')}
              </NewChargeNoticeText>
            </NewChargeNoticeCard>
          )}

          <ConfirmButton
            selected={showBtn}
            loading={confirming}
            onPress={handleConfirmTrip}
            label={translate('modalSuggestionTrip.text_button_confirm')}
          />
        </Content>
      )}
    </Container>
  );
}
