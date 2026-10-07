import { View } from 'react-native';
import {
  ContainerPrices,
  Image,
  OptionCoupon,
  OptionTravelItem,
  OptionTravelItemContent,
  RateImage,
  RateLabel,
  RateLabelContent,
  RatePriceLabel,
  RatePriceNoDiscount,
} from '../TravelOptions/styles';
import AnimationIconRocket from '../AnimatedIconRocket';
import { coinTypePerApi, formatPrice } from '../../utils/money';
import Helper from '../../utils/Helper';
import { TextEdit } from '../TextEdit';
import { SvgUri } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';
import { useTrip } from '../../contexts/Trip';
import coupom from '../../assets/images/coupon.png';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../../context/auth';
import { calculateDiscountByCoupon } from '../../utils/CalulateDiscountByCoupon';
import { translate } from '../../locales';
import { TravelOptionsCardProps } from './types';
import styles from './styles';

const isDynamicTag = (tag = ''): boolean => {
  return tag.includes('div');
};

const TravelOptionsCard = ({
  selectedOptionTravel,
  item,
  setOfferInDriver,
  onPressSelectedTripType,
  turbined,
  selectedCoupon,
  offerInDriver,
  verifyCardOnCoupon,
  coupons,
  setModalCoupon,
}: TravelOptionsCardProps) => {
  const { dispatchTripCustomer } = useTrip();
  const { cityConfig } = useAuth();
  const isSelected = selectedOptionTravel.tripTypeId === item?.tripTypeId;

  const handleSelectTripType = (): void => {
    if (isSelected) {
      onPressSelectedTripType(item);
      return;
    }

    dispatchTripCustomer({
      type: 'update',
      field: 'selectedOptionTravel',
      arg: item,
    });
    setOfferInDriver(item.price);
  };

  const hasSelectedCoupon = Object.keys(selectedCoupon).length > 0;
  const canApplyCoupon = hasSelectedCoupon && isSelected && verifyCardOnCoupon;
  const isDynamicPrice = isDynamicTag(item?.tag);

  return (
    <OptionTravelItem
      selected={isSelected}
      onPress={handleSelectTripType}
    >
      <OptionTravelItemContent>
        {item?.tripType?.picture?.split('.').pop() === 'svg' ? (
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
          {isDynamicPrice && (
            <Feather
              style={styles.trendingIcon}
              name="trending-up"
              size={RFValue(12)}
              color={theme.colors.primary}
            />
          )}
          <RateLabel turbined={turbined}>
            {`${isDynamicPrice ? item?.multiplierPriceDynamic : item?.tag}`}
          </RateLabel>
        </RateLabelContent>
        {(!hasSelectedCoupon || turbined) && (
          <View style={styles.priceContent}>
            <RatePriceLabel
              style={styles.priceLabel}
              turbined={turbined}
            >
              {formatPrice(
                offerInDriver,
                selectedOptionTravel,
                item,
                cityConfig,
                turbined,
              )}
            </RatePriceLabel>
            {turbined && <AnimationIconRocket size={RFValue(15)} />}
          </View>
        )}

        {hasSelectedCoupon && !turbined && (
          <ContainerPrices>
            <RatePriceLabel>
              {coinTypePerApi(cityConfig?.typeMoney)}{' '}
              {canApplyCoupon
                ? Helper.maskMoney(
                  calculateDiscountByCoupon(
                    item.price,
                    selectedCoupon,
                  ),
                )
                : Helper.maskMoney(item.price)}
            </RatePriceLabel>
            {canApplyCoupon && (
              <RatePriceNoDiscount>
                {coinTypePerApi(cityConfig?.typeMoney)}{' '}
                {Helper.maskMoney(item.price)}
              </RatePriceNoDiscount>
            )}
          </ContainerPrices>
        )}
      </OptionTravelItemContent>
      {coupons.length > 0 && isSelected && !turbined && (
        <OptionCoupon
          onPress={() => {
            setModalCoupon(true);
          }}
        >
          <Image source={coupom} />
          <TextEdit size={'small'} color={theme.colors.secondary}>
            {translate('coupon.see_coupon')}
          </TextEdit>
        </OptionCoupon>
      )}
    </OptionTravelItem>
  );
};

export default TravelOptionsCard;
