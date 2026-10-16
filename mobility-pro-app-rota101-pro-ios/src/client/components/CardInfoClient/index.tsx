import { Fragment, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  CloseButton,
  Container,
  ContainerClose,
  ContainerPrice,
  ContainerRow,
  DriverCaption,
  DriverRow,
  DriverTextGroup,
  Handle,
  ImageClient,
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
import { maskMoney } from '../../utils/money';
import { useAuth } from '../../../context/auth';
import { useTrip } from '../../contexts/Trip';
import { buildApp } from '../../../constantBuild/config';
import { translate } from '../../locales';
import { ImageExpanded } from '../ImageExpanded';
import { useStoragePictures } from '../../../driver/src/hooks/useStoragePictures';

interface CardInfoDriverProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const CardInfoClient = ({ visible, setVisible }: CardInfoDriverProps) => {
  const { cityConfig } = useAuth();
  const { stateTripCustomer } = useTrip();
  const { trip: tripAccepted } = stateTripCustomer;
  const [modalImage, setModalImage] = useState(false);

  const windowHeight = Dimensions.get('window').height;
  const positionY = useSharedValue(visible ? 0 : windowHeight);
  const { getStoragePictureSpecific } = useStoragePictures();

  useEffect(() => {
    positionY.value = withTiming(visible ? 0 : windowHeight, { duration: 500 });
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: positionY.value }],
  }));

  const driverImageUri =
    tripAccepted?.centralId === null
      ? `${getStoragePictureSpecific('driver') || buildApp().HOST_IMAGE_DRIVER
      }${tripAccepted?.driver?.profileImage}`
      : `${getStoragePictureSpecific('tripType') || buildApp().HOST_IMAGE_TRIP_TYPE
      }${tripAccepted?.fare?.picture}`;

  return (
    <Container style={[containerStyle]}>
      <Handle />

      <ContainerClose>
        <CloseButton onPress={() => setVisible(false)}>
          <Ionicons name="close" size={RFValue(16)} color={theme.colors.secondary} />
        </CloseButton>
      </ContainerClose>

      <DriverRow>
        <ButtonImage onPress={() => setModalImage(true)}>
          <ImageClient source={{ uri: driverImageUri }} />
        </ButtonImage>

        <DriverTextGroup>
          <DriverCaption>{translate('service.driver')}</DriverCaption>
          <TextClient>
            {tripAccepted?.driver?.name?.split(' ')[0]}{' '}
            {
              tripAccepted?.driver?.name?.split(' ')[
              tripAccepted?.driver?.name?.split(' ').length - 1
              ]
            }
          </TextClient>
        </DriverTextGroup>
      </DriverRow>

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
            <Address selected={tripAccepted?.status === translate('statusTrip.accepted')}>
              {tripAccepted?.origin?.address}
            </Address>
            {tripAccepted?.tripWayPoints?.length !== 0 &&
              tripAccepted?.tripWayPoints?.map((waypoint, index) => (
                <Address key={index}>{waypoint?.address}</Address>
              ))}
            <Address selected={tripAccepted?.status === translate('statusTrip.in_progress')}>
              {tripAccepted?.destination?.name}
            </Address>
          </AddressBlocks>
        </AddressContent>
      </AddressCard>

      <PriceCard>
        <PriceLabelRow>
          <Ionicons name="wallet-outline" size={RFValue(16)} color={theme.colors.border_green} />
          <PriceLabel>{translate('service.payment_by')}</PriceLabel>
        </PriceLabelRow>
        <Price>
          {cityConfig?.typeMoney}
          {maskMoney(Number(tripAccepted?.price))}
        </Price>
        <ContainerRow>
          <SimpleText>{tripAccepted?.tripPaymentForm}</SimpleText>
        </ContainerRow>
      </PriceCard>

      <ImageExpanded
        modalImage={modalImage}
        setModalImage={setModalImage}
        source={driverImageUri}
      />
    </Container>
  );
};
