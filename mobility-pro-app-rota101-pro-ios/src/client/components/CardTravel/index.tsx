// @ts-nocheck
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { convertDate, maskHour } from '../../utils/FormatDate';
import { maskMoneyIntl } from '../../utils/money';

import {
  ContainerCard,
  Content,
  DateCard,
  HeaderCard,
  Subtitle,
  TextTitle,
} from './styles';

import { translate } from '../../locales';
import theme from '../../styles/theme';
import { STATUS_SCHEDULED } from '../../constants/trip';

export function CardService({ trip, getListTrips, setLoading, isSpeedMob = undefined }) {
  const navigation = useNavigation();

  const formatDateAndHour = (date: string) => {
    const dateSplit = date?.split(' ');
    return `${convertDate(dateSplit[0])} ${maskHour(dateSplit[1])}`;
  };

  const handleTripUnic = async (tripDetails: any) => {
    navigation.navigate(
      `${isSpeedMob ? 'DetailsTripSpeedMob' : 'DetailsTrip'}`,
      {
        tripReference: tripDetails.tripReference,
        trip: tripDetails,
      },
    );
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
        return translate('service.not_answered');
      case 'NOT_ANSWERED':
        return translate('service.not_answered');
      case 'PAYMENT_REFUSED':
        return translate('service.payment_refused');
      default:
        return status;
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
        return theme.colors.redLight;
      default:
        return '';
    }
  };

  return (
    <>
      <ContainerCard
        activeOpacity={0.8}
        style={{ backgroundColor: switchColor(trip.status.toUpperCase()) }}
        onPress={() => {
          handleTripUnic(trip);
        }}
      >
        <HeaderCard>
          <TextTitle>{trip.type}</TextTitle>
          <TextTitle>{maskMoneyIntl(trip.price)}</TextTitle>
        </HeaderCard>
        <DateCard>
          <Subtitle>
            {trip.schedule
              ? formatDateAndHour(trip.schedule.schedule)
              : `${formatDateAndHour(trip?.date)}`}
          </Subtitle>
        </DateCard>
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
    </>
  );
}
