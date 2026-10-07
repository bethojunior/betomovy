import { Fragment, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  Address,
  AddressBlocks,
  AddressCard,
  AddressCardHeader,
  AddressCardHeaderText,
  AddressContent,
  AddressIconsColumn,
  Ball,
  ButtonImage,
  ClientCaption,
  ClientRow,
  ClientTextGroup,
  CloseButton,
  Container,
  ContainerClose,
  ContainerRow,
  Handle,
  Line,
  Price,
  PriceCard,
  PriceLabel,
  PriceLabelRow,
  SimpleText,
  Square,
  TextClient,
} from './styles';
import theme from '../../styles/theme';
import { useTripProvider } from '../../context/Trip';
import { translate } from '../../../../client/locales';
import { useTripStatusProvider } from '../../context/TripStatus';
import { useAuth } from '../../../../context/auth';
import { IsToShowField } from '../../utils/cityConfig';
import { getTripPaymentFormDisplay } from '../../utils/tripUtils';
import { ImageExpanded } from '../../../../client/components/ImageExpanded';
import Helper from '../../utils/Helper';
import { CustomerAvatar, useCustomerAvatarUri } from '../CustomerAvatar';

interface CardInfoDriverProps {
  markWaypoint: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const CardInfoDriver = ({
  markWaypoint,
  visible,
  setVisible,
}: CardInfoDriverProps) => {
  const [expand, setExpand] = useState(false);

  const statusTrip: any = useTripStatusProvider(
    (context: any) => context.statusTrip,
  );
  const { cityConfig } = useAuth();
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  const priceToShow: any = useTripProvider(
    (context: any) => context.priceToShow,
  );
  const windowHeight = Dimensions.get('window').height;
  const positionY = useSharedValue(visible ? 0 : windowHeight);

  useEffect(() => {
    positionY.value = withTiming(visible ? 0 : windowHeight, { duration: 500 });
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: positionY.value }],
  }));

  const clientImageUri = useCustomerAvatarUri(tripAccepted);

  return (
    <Container style={[containerStyle]}>
      <Handle />

      <ContainerClose>
        <CloseButton onPress={() => setVisible(false)}>
          <Ionicons name="close" size={RFValue(16)} color={theme.colors.secondary} />
        </CloseButton>
      </ContainerClose>

      <ClientRow>
        {tripAccepted?.customer?.profileImage ? (
          <ButtonImage onPress={() => setExpand(true)}>
            <CustomerAvatar trip={tripAccepted} size={RFValue(56)} />
          </ButtonImage>
        ) : (
          <CustomerAvatar trip={tripAccepted} size={RFValue(56)} />
        )}

        <ClientTextGroup>
          <ClientCaption>{translate('register.client')}</ClientCaption>
          <TextClient>
            {tripAccepted?.customer?.name?.split(' ')[0]}{' '}
            {
              tripAccepted?.customer?.name?.split(' ')[
              tripAccepted?.customer?.name?.split(' ').length - 1
              ]
            }
          </TextClient>
        </ClientTextGroup>
      </ClientRow>

      <AddressCard>
        <AddressCardHeader>
          <Ionicons name="location-outline" size={RFValue(16)} color={theme.colors.primary} />
          <AddressCardHeaderText>{translate('finishTrip.text_address')}</AddressCardHeaderText>
        </AddressCardHeader>

        <AddressContent>
          <AddressIconsColumn>
            <Ball color={theme.colors.marker_origin} />
            <Line />
            {tripAccepted?.tripWayPoints?.length !== 0 &&
              tripAccepted?.tripWayPoints?.map((_, index) => (
                <Fragment key={index}>
                  <Ball color={theme.colors.marker_waypoint} />
                  <Line />
                </Fragment>
              ))}
            <Square />
          </AddressIconsColumn>

          <AddressBlocks>
            {IsToShowField('origin', cityConfig) && (
              <Address selected={statusTrip === translate('statusTrip.accepted')}>
                {tripAccepted?.origin?.address}
              </Address>
            )}

            {tripAccepted?.tripWayPoints?.length !== 0 &&
              tripAccepted?.tripWayPoints?.map((waypoint, index) => (
                <Address
                  key={index}
                  selected={
                    statusTrip === translate('statusTrip.waypoint') &&
                    markWaypoint === index
                  }
                >
                  {waypoint?.address}
                </Address>
              ))}

            {IsToShowField('destination', cityConfig) && (
              <Address selected={statusTrip === translate('statusTrip.in_progress')}>
                {tripAccepted?.destination?.name}
              </Address>
            )}
          </AddressBlocks>
        </AddressContent>
      </AddressCard>

      {(IsToShowField('price', cityConfig) || IsToShowField('paymentForm', cityConfig)) && (
        <PriceCard>
          <PriceLabelRow>
            <Ionicons name="wallet-outline" size={RFValue(16)} color={theme.colors.border_green} />
            <PriceLabel>{translate('service.payment_by')}</PriceLabel>
          </PriceLabelRow>

          {IsToShowField('price', cityConfig) && cityConfig !== null && (
            <View>
              <Price>
                {cityConfig?.typeMoney}
                {Helper.maskMoney(priceToShow())}
              </Price>
            </View>
          )}

          {IsToShowField('paymentForm', cityConfig) && (
            <ContainerRow>
              <SimpleText>{getTripPaymentFormDisplay(tripAccepted?.tripPaymentForm)}</SimpleText>
            </ContainerRow>
          )}
        </PriceCard>
      )}

      <ImageExpanded
        modalImage={expand}
        setModalImage={setExpand}
        source={clientImageUri}
      />
    </Container>
  );
};
