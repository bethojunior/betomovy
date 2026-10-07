import {useCallback, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';

import {BackHandler} from 'react-native';
import {debounce} from 'lodash';
import {useLocal} from '../../contexts/local';

import {Container, ContainerDuration} from './styles';
import theme from '../../styles/theme';
import {If} from '../../components/If';
import {TextEdit} from '../../components/TextEdit';
import apiMain from '../../api/apiMain';
import {useAuth} from '../../../context/auth';
import {STATUS_BOARDING} from '../../constants/trip';
import Helper from '../../utils/Helper';
import {ProgressBar} from '../../components/ProgressBar';
import {DestinationFree} from './types';
import {ModalDataDriver} from '../../components/ModalDataDriver';
import TripContentView from '../../components/TripContent/TripContentView';
import WebView from 'react-native-webview';
import {buildApp} from '../../../constantBuild/config';

interface TypeProps {
  id: string;
  name: string;
  statusId: string;
}

export default function TripView({route}) {
  const [trip, setTrip] = useState(route?.params);
  const {generalSettings} = useAuth();
  const [modalDriverData, setModalDriverData] = useState(false);
  const {distance} = trip;

  const navigation = useNavigation();

  useEffect(() => {
    if (Object.keys(trip).length > 0) {
      BackHandler.addEventListener('hardwareBackPress', () => {
        return true;
      });
    } else {
      BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('TripRoutes', {screen: 'Home'});
        return true;
      });
    }
  }, [trip]);

  const injectJSSite = `
    const containerDriver = document.querySelector('.container-data-driver')
    const containerDestination = document.querySelector('.container-destination')
    containerDriver.style.display = 'none';
    containerDestination.style.display = 'none';
  `;

  return (
    <>
      <Container>
        <Ionicons
          name="arrow-back"
          size={30}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 1000,
            backgroundColor: 'transparent',
            color: theme.colors.primary,
          }}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <WebView
          style={{
            flex: 1,
          }}
          source={{
            uri: `${buildApp().HOST_SITE}trip/${trip?.tripReference}/share`,
          }}
          injectedJavaScript={injectJSSite}
        />
        <ProgressBar visible={trip?.status == STATUS_BOARDING} />
        <If condition={distance && trip && !trip.driver}>
          <ContainerDuration>
            <TextEdit color={theme.colors.primaryText}>
              {`${Helper.kmToMiles(
                Number(distance || 0).toFixed(1),
                Helper.generalSettingsActive(
                  generalSettings,
                  'enable_transform_km_for_mi',
                ),
              )}`}
            </TextEdit>
          </ContainerDuration>
        </If>
        <TripContentView
          trip={trip}
          setTrip={setTrip}
          setModalDriverData={setModalDriverData}
        />
        <ModalDataDriver
          visible={modalDriverData}
          setVisible={setModalDriverData}
        />
      </Container>
    </>
  );
}
