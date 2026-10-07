// @ts-nocheck

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Text} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'react-native-paper';
import {Entypo} from '@expo/vector-icons';
import WebView from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
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
import {
  LastPlaceItem,
  LastPlaceItemContent,
  LastPlaceItemIcon,
  LastPlaceItemText,
  LastPlaces,
} from '../../../mobility/pages/Home/styles';
import mapStyle from '../../../../styles/map.json';
import {useLocal} from '../../../../contexts/local';
import {useTrip} from '../../../../contexts/Trip';
import DriverMarker from '../../../../components/DriverMarker';
import DestinationRoute from '../../../../components/DestinationRoute';
import theme from '../../../../styles/theme';
import {translate} from '../../../../locales';
import ModalFrame from '../../../../components/form/Modal';
import {ContentCenter} from '../Favorites/styles';
import {TextTitle} from '../../components/CardService/styles';
import Preload from '../../../../components/Preload';
import {ModalChat} from '../../components/ModalChat';
import {HomeGetLight} from '../SplashScreen';
import {useAuth} from '../../../../../context/auth';
import {useTripGL} from '../../../../contexts/TripGL';
import {If} from '../../components/If';
import {NotificationModalMessage} from '../../../../components/ModalMessage';
import {useDynamicAnimation} from 'moti';
import { ChatRealtime } from '../../../../services/realtime/ChatRealtime';

export function TripScheduleCurrent() {
  const {position} = useLocal();
  const {user} = useAuth();
  const {navigate, isFocused} = useNavigation();
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
  const [message, setMessage] = useState({});
  const [newMessageNotification, setNewMessageNotification] = useState(false);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const animationMessage = useDynamicAnimation(() => {
    return {
      transform: [{translateY: 500}],
    };
  });

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
    if (newMessage)
      setTimeout(() => {
        setNewMessage(false);

        animationMessage.animateTo({
          transform: [{translateY: 500}],
          opacity: 0.7,
        });
      }, 5000);
  }, [newMessage]);

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
      chatRealtime.getLastMessageUnread(
        tripSchedule.tripReference,
        ({item, id}) => {
          if (
            // eslint-disable-next-line eqeqeq
            item.userId != user?.idUser &&
            !item.viewed &&
            isFocused()
          ) {
            setMessage(item);
            setNewMessage(true);
            setNewMessageNotification(true);
          }
        },
      );
    }
  }, [tripSchedule]);

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
      <If condition={message?.message && newMessage}>
        <NotificationModalMessage
          animationMessage={animationMessage}
          isAudio={message?.isAudio}
          message={message}
          setNewMessage={setNewMessage}
          setNewMessageNotification={setNewMessageNotification}
          tripProps={tripSchedule}
        />
      </If>
      <HomeGetLight visible={splashVisible()} />
      {tripSchedule &&
        Object.keys(tripSchedule).length > 0 &&
        mapRef != null && (
          <>
            <Preload visible={loading} />
            <HeaderContainer>
              <Title>{user.nameUser}</Title>
              <SubTitle>{routeTripScheduled?.time ?? ''}</SubTitle>
            </HeaderContainer>
            {/* {console.log(routeTripScheduled)} */}
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
                      onRegionChangeComplete={regionValue => {
                        setRegion(regionValue);
                      }}
                      style={{flex: 1}}
                      showsUserLocation={!polylineCoordinates}
                      customMapStyle={mapStyle}
                    >
                      {tripSchedule != null && (
                        <Marker
                          title={tripSchedule?.origin.address}
                          coordinate={{
                            latitude: parseFloat(tripSchedule?.origin.latitude),
                            longitude: parseFloat(
                              tripSchedule?.origin.longitude,
                            ),
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
                  <Button
                    color={theme.colors.white}
                    onPress={() => navigate('TripChat')}
                  >
                    <Entypo name="message" size={30} />
                  </Button>
                  <Button
                    color={theme.colors.white}
                    onPress={handleModalCancel}
                  >
                    {translate('schedule.cancel')}
                  </Button>
                </ContainerActions>
              </StatusInfo>
              {driverLoaded === true && (
                <ContainerInfo>
                  <Image source={{uri: tripSchedule?.driver?.profilePicture}} />
                  <ContainerContent>
                    <Title>{tripSchedule?.driver.name} </Title>
                    <SubTitle>{tripSchedule?.driver?.car?.plate}</SubTitle>
                  </ContainerContent>
                  <Star>
                    {' '}
                    <Ionicons name="star" />{' '}
                    {tripSchedule?.driver?.driverRating}
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
    </>
  );
}
