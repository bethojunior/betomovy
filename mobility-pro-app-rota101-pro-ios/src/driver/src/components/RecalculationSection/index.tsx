import { translate } from "~/client/locales";
import Helper from "~/client/utils/Helper";
import {
  ButtonChoosePrice,
  ContainerChoosePrice,
  ContentChoosePrice,
  Price,
  PriceContainer,
  PriceText,
  SectionTripReward,
  TextReward,
  Title,
  TitleChoosePrice,
  ValueText
} from "./styles";
import { ActivityIndicator } from "react-native";

export const RecalculationSection = ({
  hasRecalculation,
  valueConfirmed,
  priceSelected,
  loading1,
  loading2,
  tripAccepted,
  typeMoney,
  selectedPrice,
  setLoading1,
  setLoading2,
  recalculate,
  recalculated
}) => {
  const showTripReward = hasRecalculation &&
    (
      !valueConfirmed ||
      !priceSelected
    )
  return (
    <SectionTripReward visible={showTripReward}>
      <Title>{translate('finishTrip.title_recalculation')}</Title>

      <TextReward>{translate('finishTrip.text_recalculation')}</TextReward>

      {!priceSelected ? (
        <ContainerChoosePrice>
          <ButtonChoosePrice
            isOriginal
            activeOpacity={0.8}
            onPress={() => {
              setLoading1(true);
              recalculate(false, false);
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
                    {typeMoney}{' '}
                    {Helper.maskMoney(Number(tripAccepted?.price ?? 0))}
                  </Price>
                </>
              )}
            </ContentChoosePrice>
          </ButtonChoosePrice>
          <ButtonChoosePrice
            activeOpacity={0.8}
            onPress={() => {
              setLoading2(true);
              recalculate(true, false);
            }}
            disabled={loading1 || loading2}
          >
            <ContentChoosePrice>
              {loading2 ? (
                <ActivityIndicator size={20} color="#fff" />
              ) : (
                <>
                  <TitleChoosePrice>
                    {translate('finishTrip.text_recalculated')}
                  </TitleChoosePrice>
                  <Price>
                    {typeMoney}{' '}
                    {Helper.maskMoney(Number(recalculated?.price ?? 0))}
                  </Price>
                </>
              )}
            </ContentChoosePrice>
          </ButtonChoosePrice>
        </ContainerChoosePrice>
      ) : (
        <ContainerChoosePrice>
          <PriceContainer>
            <ValueText>
              Valor selecionado
            </ValueText>

            <PriceText>
              {typeMoney} {Helper.maskMoney(Number(selectedPrice ?? 0))}
            </PriceText>
          </PriceContainer>
        </ContainerChoosePrice>
      )}
    </SectionTripReward >
  )
}
