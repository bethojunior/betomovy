// @ts-nocheck
import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Dialog } from 'react-native-elements';
import { convertDate, maskHour } from '../../../../utils/FormatDate';
import { coinTypePerApi, maskMoneyIntl } from '../../../../utils/money';

import {
  ContainerButton,
  ContainerCard,
  ContainerDialog,
  Content,
  DateCard,
  HeaderCard,
  Subtitle,
  TextTitle,
} from './styles';
import { ButtonSmall } from '../ButtonSmall';
import { useTrip } from '../../../../contexts/Trip';
import Preload from '../../../../components/Preload';
import { translate } from '../../../../locales';
import theme from '../../../../styles/theme';
import { If } from '../If';
import { STATUS_SCHEDULED } from '../../../../constants/trip';
import Helper from '../../../../utils/Helper';
import { useAuth } from '../../../../../context/auth';
import { useTripGL } from '../../../../contexts/TripGL';
import ModalFrame from '../../../../components/form/Modal';
import { TextEdit } from '../../../../components/TextEdit';
import { View } from 'react-native';

export function CardService({ trip, getListTrips, setLoading }) {
  const [modalDetails, setModalDetails] = useState(false);
  const [tripSelected, setTripSelected] = useState({});
  const { cityConfig } = useAuth();

  const { cancelTripByCustomerSchedule } = useTripGL();

  const formatDateAndHour = (date: string) => {
    const dateSplit = date?.split(' ');
    return `${convertDate(dateSplit[0])} ${maskHour(dateSplit[1])}`;
  };

  const handleModal = () => {
    setModalDetails(!modalDetails);
  };

  const handleTripUnic = (tripDetails: any) => {
    setTripSelected(tripDetails);
    handleModal();
  };
  const cancelTripBySchedule = async tripReference => {
    setLoading(true);
    handleModal();
    await cancelTripByCustomerSchedule(tripReference);
    await getListTrips();
    setLoading(false);
  };

  const switchStatus = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return translate('service.scheduled');
      case 'IN_PROGRESS':
        return translate('request.text_in_progress');
      case 'FINISHED':
        return translate('service.finished');
      case 'CANCELED':
        return translate('service.cancel');
      case 'BACK_OFF':
        return 'Desistido';
      case 'NOT_ANSWERED':
        return translate('service.not_answered');
      case 'PAYMENT_REFUSED':
        return translate('service.payment_refused');
      default:
        return '';
    }
  };
  const switchColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return theme.colors.yellowLight;
      case 'IN_PROGRESS':
        return theme.colors.yellowLight;
      case 'FINISHED':
        return theme.colors.background_greenLight;
      case 'CANCELED':
        return theme.colors.redLight;
      case 'BACK_OFF':
        return theme.colors.border;
      case 'NOT_ANSWERED':
        return theme.colors.border;
      case 'PAYMENT_REFUSED':
        return theme.colors.border;
      default:
        return '';
    }
  };

  return (
    <>
      <ContainerCard
        activeOpacity={0.8}
        style={{ backgroundColor: switchColor(trip.status.toUpperCase()) }}
        onPress={() => handleTripUnic(trip)}
      >
        <HeaderCard color={theme.colors.white}>
          <View>
            <TextTitle>{trip.type}</TextTitle>
            <TextEdit change="capitalize" color={theme.colors.primary}>
              {translate('schedule.select_date')?.split(' ').pop()}:{' '}
              {trip.schedule
                ? formatDateAndHour(trip.schedule.schedule)
                : `${formatDateAndHour(trip?.date)}`}
            </TextEdit>
          </View>

          <TextTitle>
            {`${coinTypePerApi(cityConfig?.typeMoney)} ${Helper.maskMoney(
              parseFloat(trip.price),
            )}`}
          </TextTitle>
        </HeaderCard>
        <Content>
          <Subtitle>
            {switchStatus(trip.status.toUpperCase())}{' '}
            {trip.driverName &&
              trip.status === STATUS_SCHEDULED.toLowerCase() &&
              `e ${translate('service.schedule_by')} ${trip.driverName}`}{' '}
          </Subtitle>
          <Subtitle>
            {translate('service.payment_by')} {trip.paymentForm}
          </Subtitle>
          <Subtitle>{trip.originAddress}</Subtitle>
        </Content>
      </ContainerCard>
      <ModalFrame
        visible={modalDetails}
        setVisible={setModalDetails}
        hideConfirm={true}
        onClose={() => {
          if (trip?.status === STATUS_SCHEDULED.toLowerCase()) {
            cancelTripBySchedule(trip.tripReference);
          }
          setModalDetails(false);
        }}
      >
        <AntDesign name="close" size={30} color="black" onPress={handleModal} />
        <ContainerDialog>
          <HeaderCard>
            <Content>
              <Subtitle>{switchStatus(trip.status.toUpperCase())}</Subtitle>
              <TextEdit color={theme.colors.primary} change="capitalize">
                {trip.schedule
                  ? formatDateAndHour(trip.schedule.schedule)
                  : `${translate('schedule.select_date')
                    ?.split(' ')
                    .pop()}: ${formatDateAndHour(trip?.date)}`}
              </TextEdit>
            </Content>
            <TextTitle>{`${coinTypePerApi(
              cityConfig?.typeMoney,
            )} ${Helper.maskMoney(parseFloat(trip.price))}`}</TextTitle>
          </HeaderCard>
        </ContainerDialog>
        <ContainerDialog>
          <Content>
            <Subtitle>{trip.originAddress}</Subtitle>
          </Content>
          {trip.driverName &&
            trip.status === STATUS_SCHEDULED.toLowerCase() && (
              <Content>
                <TextTitle>
                  {translate('service.schedule_by')} {trip.driverName}
                </TextTitle>
              </Content>
            )}
        </ContainerDialog>
      </ModalFrame>
    </>
  );
}
