import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  ContainerActions,
  ContainerContent,
  ContainerInfo,
  HeaderContainer,
  Image,
  MapContainer,
  Star,
  StatusInfo,
  StatusInfoText,
  SubTitle,
  Title,
} from './styles';

import mapStyle from '../../../../styles/map.json';
import { useLocal } from '../../../../contexts/local';
import DriverMarker from '../../../../components/DriverMarker';
import theme from '../../../../styles/theme';
import { translate } from '../../../../locales';
import ModalFrame from '../../../../components/form/Modal';
import { ContentCenter } from '../Favorites/styles';
import { TextTitle } from '../../components/CardService/styles';
import Preload from '../../../../components/Preload';
import { ModalChat } from '../../components/ModalChat';
import { HomeGetLight } from '../SplashScreen';
import { useAuth } from '../../../../../context/auth';
import { useTripGL } from '../../../../contexts/TripGL';
import { MessageProps, NotificationMessage } from '~/components/NotificationMessage';
import { ChatRealtime } from '../../../../services/realtime/ChatRealtime';

export function TripScheduleCurrent() {
  const { position } = useLocal();
  const { user } = useAuth();
  const { navigate, isFocused } = useNavigation<any>();
  const {
    polylineCoordinates,
    routeTripScheduled,
    tripSchedule,
    cancelTripByCustomerSchedule,
    tripStatus,
  } = useTripGL();
  const mapRef = useRef<any>(null);
  const [modalCancel, setModalCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleChat, setVisibleChat] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [message, setMessage] = useState<MessageProps | null>(null);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const handleVisibleChat = useCallback(() => {
    setVisibleChat(true);
  }, [visibleChat]);

  const handleModalCancel = useCallback(() => {
    setModalCancel(true);
  }, [modalCancel]);

  const handleCloseModalCancel = useCallback(() => {
    setModalCancel(false);
  }, [modalCancel]);

  const [region, setRegion] = useState(
    position
      ? {
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }
      : null,
  );
  const [driverLoaded, setDriverLoaded] = useState(false);

  useEffect(() => {
    if (polylineCoordinates && mapRef != null && mapRef?.current !== null) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(polylineCoordinates, {
          animated: true,
        });
      }, 1500);
    }
  }, [polylineCoordinates, mapRef.current]);

  useEffect(() => {
    if (tripSchedule?.driver) {
      setDriverLoaded(true);
    } else {
      setDriverLoaded(false);
    }

    if (tripSchedule.tripReference) {
      const unsubscribe = chatRealtime.getLastMessageUnread(
        tripSchedule.tripReference,
        ({ item, id }) => {
          if (item.userId != user?.idUser && !item.viewed && isFocused()) {
            setMessage(item);
            setNewMessage(true);
          }
        },
      );

      return () => unsubscribe();
    }
  }, [tripSchedule?.tripReference]);

  const cancelTrip = useCallback(async (tripReference: string) => {
    setLoading(true);
    handleCloseModalCancel();
    await cancelTripByCustomerSchedule(tripReference);
    setLoading(false);
  }, []);

  const splashVisible = () => {
    if (!polylineCoordinates && !routeTripScheduled) {
      return true;
    }
    return setTimeout(() => {
      return false;
    }, 10000);
  };

  return (
    <>
      <HomeGetLight visible={splashVisible()} />
      {tripSchedule && Object.keys(tripSchedule).length > 0 && mapRef != null && (
        <>
          <Preload visible={loading} />
          <HeaderContainer>
            <Title>{user.nameUser}</Title>
            <SubTitle>{routeTripScheduled?.time ?? ''}</SubTitle>
          </HeaderContainer>
          <Container>
            {position && mapRef !== null && (
              <MapContainer>
                {position && (
                  <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    mapPadding={{
                      bottom: 15,
                      top: 80,
                      left: 16,
                      right: 30,
                    }}
                    region={!polylineCoordinates ? region : null}
                    onRegionChangeComplete={(regionValue) => {
                      setRegion(regionValue);
                    }}
                    style={{ flex: 1 }}
                    showsUserLocation={!polylineCoordinates}
                    customMapStyle={mapStyle}
                    userInterfaceStyle="light"
                  >
                    {tripSchedule != null && (
                      <Marker
                        title={tripSchedule?.origin.address}
                        coordinate={{
                          latitude: parseFloat(tripSchedule?.origin.latitude),
                          longitude: parseFloat(tripSchedule?.origin.longitude),
                        }}
                      />
                    )}
                    {/* {destination.latitude && (
                  <Marker
                    title={destination.address}
                    coordinate={{
                      latitude: parseFloat(destination.latitude),
                      longitude: parseFloat(destination.longitude),
                    }}
                  />
                )} */}
                    {polylineCoordinates && (
                      <Polyline
                        coordinates={polylineCoordinates}
                        strokeColor={theme.colors.black}
                        // strokeColors={[theme.colors.white, theme.colors.black]}
                        strokeWidth={6}
                      />
                    )}
                    <DriverMarker />
                    {/* <DestinationRoute /> */}
                  </MapView>
                )}
              </MapContainer>
            )}
            <StatusInfo>
              <StatusInfoText>
                {tripStatus === 'accepted'
                  ? translate('schedule.inRace')
                  : translate('schedule.it_arrived')}
              </StatusInfoText>
              <ContainerActions>
                <Button color={theme.colors.white} onPress={() => navigate('TripChat')}>
                  <Entypo name="message" size={30} />
                </Button>
                <Button color={theme.colors.white} onPress={handleModalCancel}>
                  {translate('schedule.cancel')}
                </Button>
              </ContainerActions>
            </StatusInfo>
            {driverLoaded === true && (
              <ContainerInfo>
                <Image source={{ uri: tripSchedule?.driver?.profilePicture }} />
                <ContainerContent>
                  <Title>{tripSchedule?.driver.name} </Title>
                  <SubTitle>{tripSchedule?.driver?.car?.plate}</SubTitle>
                </ContainerContent>
                <Star>
                  {' '}
                  <Ionicons name="star" /> {tripSchedule?.driver?.driverRating}
                </Star>
              </ContainerInfo>
            )}
          </Container>
          {/* Modal Delete */}
          <ModalFrame
            visible={modalCancel}
            setVisible={setModalCancel}
            onPressConfirm={() => cancelTrip(tripSchedule?.tripReference)}
            onClose={handleCloseModalCancel}
          >
            <ContentCenter>
              <TextTitle> {translate('schedule.cancel_question')} </TextTitle>
            </ContentCenter>
          </ModalFrame>

          {/* Modal Chat */}
          <ModalChat visible={visibleChat} setVisible={setVisibleChat} />
        </>
      )}

      <NotificationMessage
        visible={!!message?.message}
        message={message}
        isAudio={message?.isAudio}
        title={tripSchedule?.driver?.name}
        pictureUri={tripSchedule?.driver?.profilePicture}
        onPress={() => navigate('TripChat', { trip: tripSchedule })}
        onRead={() => setNewMessage(false)}
        onDismiss={() => setMessage(null)}
      />
    </>
  );
}
