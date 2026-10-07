import Animated from "react-native-reanimated";
import { AvaliableText, ClientPhoto, ConfirmButton, ContentButtonAvaliable, HeaderAvaliable, Modall, NameClient, PriceContainer, PriceText, ShowPrice, TextButton, Title, TitleResume } from "../styles";
import { ActivityIndicator, View } from "react-native";
import { translate } from "../../../../../../client/locales";
import StarRatings from "../../../StarRatings";
import theme from "../../../../../../client/styles/theme";
import React from "react";
import { TripInfo } from "../../../../context/Trip/types";
import { buildApp } from "../../../../../../constantBuild/config";
import { DecisionsActions } from "../../../../../../client/components/DecisionActions";
import { RenderSvgImage } from "../../../../../../common/RenderSvgImage";
import QRCode from "react-native-qrcode-svg";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { MONEY_IN_LOCAL } from "../../../../../../client/constants/paymentFormType";
import { useAuth } from "../../../../../../context/auth";
import Helper from "../../../../../../client/utils/Helper";

interface AvaliableProps {
  animatedStyles: any;
  screenDimensions: number;
  tripAccepted: TripInfo;
  sendAvaliable: () => void;
  loadingAvaliation: boolean;
  setLoadingAvaliation: (val: boolean) => void;
  handleReprove: (e: string, type: string, id: number) => void;
  priceChoose: string;
}

export const Avaliable = ({
  animatedStyles,
  screenDimensions,
  tripAccepted,
  loadingAvaliation,
  sendAvaliable,
  setLoadingAvaliation,
  handleReprove,
  priceChoose
}: AvaliableProps) => {
  const { cityConfig } = useAuth();

  const mapAvaliations = [
    {
      title: translate('finishTrip.map'),
      type: 'Map',
      id: 1,
      text: translate('finishTrip.blockAddressOrigin')
    },
    {
      type: 'Map',
      id: 2,
      text: translate('finishTrip.blockAddressDestination')
    },
    {
      title: translate('finishTrip.security'),
      type: 'Security',
      id: 1,
      text: translate('finishTrip.riskAreaOrigin')
    },
    {
      type: 'Security',
      id: 2,
      text: translate('finishTrip.riskAreaDestination')
    }
  ]

  return (
    <Animated.View style={[animatedStyles, { height: screenDimensions }]}>
      <Modall style={{ marginTop: '90%' }}>
        {
          Number(tripAccepted.paymentFormTypeId) === MONEY_IN_LOCAL
            ? <>
              <View style={{ alignItems: 'center', marginTop: RFValue(-10) }}>
                <PriceContainer>
                  <PriceText>
                    {translate('finishTrip.amount_receivable')}
                  </PriceText>
                  <ShowPrice>
                    {cityConfig.typeMoney} {priceChoose || Helper.maskMoney(Number(tripAccepted.price))}
                  </ShowPrice>
                  <LinearGradient
                    colors={[
                      'rgba(239, 239, 240, 0.3)',
                      'red',
                      'rgba(239, 239, 240, 0.3)'
                    ]}
                    locations={[0, 0.5, 1]}
                    style={{ width: '100%', height: 1.5 }}
                  ></LinearGradient>
                </PriceContainer>
                {
                  tripAccepted?.pix
                    ? <QRCode value={tripAccepted?.pix} size={RFValue(150)} />
                    : ''
                }

              </View>
            </>
            : ''
        }
        <HeaderAvaliable>
          {tripAccepted?.centralId === null ?
            <ClientPhoto
              source={{
                uri:
                  `${buildApp().HOST_IMAGE_CUSTOMER}${tripAccepted?.customer?.profileImage
                  }`
              }}
            /> : <RenderSvgImage image={`${buildApp().HOST_IMAGE_TRIP_TYPE}${tripAccepted?.fare?.picture}`} width={85} heigth={85} />
          }
          <View style={{ marginLeft: 10 }}>
            <NameClient>
              {tripAccepted?.customer?.name?.split(' ')[0]}{' '}
              {tripAccepted?.customer?.name?.split(' ')[
                tripAccepted?.customer?.name?.split(' ').length - 1
              ] || ''}
            </NameClient>
            <View>
              <AvaliableText>{translate('finishTrip.text_rate')}</AvaliableText>
              <StarRatings />
            </View>
          </View>
        </HeaderAvaliable>
        <Title>{translate('finishTrip.text_map')}</Title>

        {
          mapAvaliations.map((item, index) => {
            return (
              <View key={index}>
                {item.title ? <TitleResume>{item.title.toUpperCase()}</TitleResume> : ''}
                <ContentButtonAvaliable>
                  <DecisionsActions onPressAction={
                    (e) =>
                      handleReprove(e, item.type, item.id)
                  } text={item.text} />
                </ContentButtonAvaliable>
              </View>
            )
          })
        }
        <ConfirmButton
          activeOpacity={0.8}
          onPress={() => {
            sendAvaliable();
            setLoadingAvaliation(true);
          }}
          disabled={loadingAvaliation}
        >
          {loadingAvaliation ? (
            <ActivityIndicator size={20} color={theme.colors.primaryText} />
          ) : (
            <TextButton>{translate('finishTrip.title_avaliations')}</TextButton>
          )}
        </ConfirmButton>
      </Modall>
    </Animated.View>
  );
};

export const AvaliableComponent = React.memo(Avaliable);