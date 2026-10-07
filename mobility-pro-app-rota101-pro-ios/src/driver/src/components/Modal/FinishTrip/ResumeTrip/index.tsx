import Animated from 'react-native-reanimated';
import {
  ButtonChoosePrice,
  ConfirmButton,
  ContainerChoosePrice,
  ContentChoosePrice,
  Info,
  Modall,
  Price,
  SectionPayment,
  SectionTripReward,
  TextButton,
  TextReward,
  Title,
  TitleChoosePrice,
  TitleResume,
} from '../styles';
import {translate} from '../../../../../../client/locales';
import {ActivityIndicator, View} from 'react-native';
import Helper from '../../../../utils/Helper';
import React from 'react';
import {TripInfo} from '../../../../context/Trip/types';
import {useAuth} from '../../../../../../context/auth';
import {useTripStatusProvider} from '../../../../context/TripStatus';

interface ResumeTripProps {
  animatedStyles: any;
  screenDimensions: number;
  recalculate: (val?: boolean) => void;
  setLoading1: (val: boolean) => void;
  loading1: boolean;
  tripAccepted: TripInfo;
  loading2: boolean;
  setLoading2: (val: boolean) => void;
  closeResume: () => void;
}

export const ResumeTrip = ({
  animatedStyles,
  screenDimensions,
  recalculate,
  setLoading1,
  loading1,
  tripAccepted,
  loading2,
  setLoading2,
  closeResume,
}: ResumeTripProps) => {
  const {cityConfig} = useAuth();
  const {hasRecalculation, recalculated} = useTripStatusProvider();

  return (
    <Animated.View style={[animatedStyles, {height: screenDimensions}]}>
      <Modall>
        <SectionTripReward visible={hasRecalculation}>
          <Title>{translate('finishTrip.title_recalculation')}</Title>

          <TextReward>{translate('finishTrip.text_recalculation')}</TextReward>

          <ContainerChoosePrice>
            <ButtonChoosePrice
              isOriginal
              activeOpacity={0.8}
              onPress={() => {
                recalculate();
                setLoading1(true);
              }}
              disabled={loading1 || loading2}
            >
              <ContentChoosePrice>
                {loading1 ? (
                  <ActivityIndicator size={20} color="#fff" />
                ) : (
                  <>
                    <TitleChoosePrice isOriginal>
                      {translate('finishTrip.text_original')}
                    </TitleChoosePrice>
                    <Price isOriginal>
                      {cityConfig?.typeMoney}{' '}
                      {Helper.maskMoney(Number(tripAccepted?.price || 0))}
                    </Price>
                  </>
                )}
              </ContentChoosePrice>
            </ButtonChoosePrice>
            <ButtonChoosePrice
              activeOpacity={0.8}
              onPress={() => {
                recalculate(true);
                setLoading2(true);
              }}
              disabled={loading1 || loading2}
            >
              <ContentChoosePrice>
                {loading2 ? (
                  <ActivityIndicator size={20} color="#fff," />
                ) : (
                  <>
                    <TitleChoosePrice>
                      {translate('finishTrip.text_recalculated')}
                    </TitleChoosePrice>
                    <Price>
                      {cityConfig?.typeMoney}{' '}
                      {Helper.maskMoney(Number(recalculated?.price)) || 0}
                    </Price>
                  </>
                )}
              </ContentChoosePrice>
            </ButtonChoosePrice>
          </ContainerChoosePrice>
        </SectionTripReward>

        <Title>{translate('finishTrip.title_resume')}</Title>

        <SectionPayment>
          <View>
            <TitleResume>{translate('finishTrip.text_payment')}</TitleResume>
            <Info>{tripAccepted?.tripPaymentForm}</Info>
          </View>
          {!hasRecalculation && (
            <View>
              <TitleResume>{translate('finishTrip.text_value')}</TitleResume>
              <Info>
                {cityConfig?.typeMoney}{' '}
                {Helper.maskMoney(Number(tripAccepted?.price || 0))}
              </Info>
            </View>
          )}
        </SectionPayment>

        <View>
          <TitleResume>{translate('finishTrip.text_origin')}</TitleResume>
          <Info numberOfLines={2}>{tripAccepted?.origin?.address}</Info>
        </View>
        {tripAccepted?.tripWayPoints?.length !== 0 && (
          <View>
            <TitleResume>
              {translate('finishTrip.text_waypoint') +
                '+' +
                tripAccepted?.tripWayPoints?.length}
            </TitleResume>
          </View>
        )}
        <View>
          <TitleResume>{translate('finishTrip.text_destination')}</TitleResume>
          <Info numberOfLines={2}>{tripAccepted?.destination?.name}</Info>
        </View>
        {!hasRecalculation && (
          <ConfirmButton activeOpacity={0.8} onPress={closeResume}>
            <TextButton>{translate('finishTrip.title_proceed')}</TextButton>
          </ConfirmButton>
        )}
      </Modall>
    </Animated.View>
  );
};

export const ResumeTripComponent = React.memo(ResumeTrip);
