import { View } from "react-native";
import { If } from "../If";
import { ContainerPrices, Image, OptionCoupon, OptionTravelItem, OptionTravelItemContent, RateImage, RateLabel, RateLabelContent, RatePriceLabel, RatePriceNoDiscount } from "../TravelOptions/styles";
import AnimationIconRocket from "../AnimatedIconRocket";
import { coinTypePerApi, formatPrice } from "../../utils/money";
import Helper from "../../utils/Helper";
import { TextEdit } from "../TextEdit";
import { SvgUri } from "react-native-svg";
import { RFValue } from "react-native-responsive-fontsize";
import theme from "../../styles/theme";
import { useTrip } from "../../contexts/Trip";
import coupom from '../../assets/images/coupon.png';
import { Feather } from '@expo/vector-icons';
import { useAuth } from "../../../context/auth";
import { calculateDiscountByCoupon } from "../../utils/CalulateDiscountByCoupon";
import { travelOptionsCardProps } from "./types";
import { memo } from "react";

const TravelOptionsCard = ({
  selectedOptionTravel,
  item,
  setOfferInDriver,
  turbined,
  selectedCoupon,
  offerInDriver,
  verifyCardOnCoupon,
  coupons,
  setModalCoupon
}: travelOptionsCardProps) => {
  const { dispatchTripCustomer } = useTrip();
  const { cityConfig } = useAuth();

  const transformTag = (tag: string) => {
    return tag.includes('div');
  };

  const selectTripType = () => {
    dispatchTripCustomer({
      type: 'update',
      field: 'selectedOptionTravel',
      arg: item,
    });
    setOfferInDriver(item.price);
  }

  return (
    <OptionTravelItem
      selected={selectedOptionTravel.tripTypeId === item?.tripTypeId}
      onPress={selectTripType}
    >
      <OptionTravelItemContent>
        {item?.tripType?.picture.split('.').pop() === 'svg' ? (
          <SvgUri
            width={RFValue(60)}
            height={RFValue(60)}
            uri={item?.tripType?.picture}
          />
        ) : (
          <RateImage
            source={{
              uri: item?.tripType?.picture,
            }}
          />
        )}
        <RateLabelContent>
          <If condition={transformTag(item?.tag)}>
            <Feather
              style={{ marginRight: 5 }}
              name="trending-up"
              size={RFValue(12)}
              color={theme.colors.primary}
            />
          </If>
          <RateLabel turbined={turbined}>
            {`${transformTag(item?.tag)
              ? item?.multiplierPriceDynamic
              : item?.tag
              }`}
          </RateLabel>
        </RateLabelContent>
        <If condition={Object.keys(selectedCoupon).length === 0}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
            }}
          >
            <RatePriceLabel
              style={{
                marginLeft: 10,
              }}
              turbined={turbined}
            >
              {formatPrice(
                offerInDriver,
                selectedOptionTravel,
                item,
                cityConfig,
                turbined
              )}
            </RatePriceLabel>
            <If condition={turbined}>
              <AnimationIconRocket size={RFValue(15)} />
            </If>
          </View>
        </If>

        <If condition={Object.keys(selectedCoupon).length > 0}>
          <ContainerPrices>
            <RatePriceLabel>
              {coinTypePerApi(cityConfig?.typeMoney)}{' '}
              {Object.keys(selectedCoupon).length > 0 &&
                selectedOptionTravel.tripTypeId === item.tripTypeId &&
                verifyCardOnCoupon
                ? Helper.maskMoney(
                  calculateDiscountByCoupon(
                    parseFloat(item.price),
                    selectedCoupon,
                  ),
                )
                : Helper.maskMoney(parseFloat(item.price))}
            </RatePriceLabel>
            <If
              condition={
                Object.keys(selectedCoupon).length > 0 &&
                selectedOptionTravel.tripTypeId === item.tripTypeId &&
                verifyCardOnCoupon
              }
            >
              <RatePriceNoDiscount>
                {coinTypePerApi(cityConfig?.typeMoney)}{' '}
                {Helper.maskMoney(parseFloat(item.price))}
              </RatePriceNoDiscount>
            </If>
          </ContainerPrices>
        </If>
      </OptionTravelItemContent>
      <If
        condition={
          coupons.length > 0 &&
          selectedOptionTravel.tripTypeId === item.tripTypeId
        }
      >
        <OptionCoupon
          onPress={() => {
            setModalCoupon(true);
          }}
        >
          <Image source={coupom} />
          <TextEdit size={'small'} color={theme.colors.secondary}>
            Veja Cupom
          </TextEdit>
        </OptionCoupon>
      </If>
    </OptionTravelItem>
  )
}

export default TravelOptionsCard;