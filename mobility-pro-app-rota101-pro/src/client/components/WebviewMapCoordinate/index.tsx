import {ActivityIndicator, Modal, TouchableOpacity} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import WebView from 'react-native-webview';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../styles/theme';
import {useTrip} from '../../contexts/Trip';
import {HeaderModal} from '../../modules/GetLight/components/ModalChat/styles';
import {buildApp} from '../../../constantBuild/config';
import { useAuth } from '../../../context/auth';

interface Props {
  onVisible: boolean;
  setOnVisible: (value: boolean) => void;
  latitude?: number;
  longitude?: number;
}

export const WebviewMapCoordinate = ({
  onVisible,
  setOnVisible,
  latitude,
  longitude,
}: Props) => {
  const {dispatchTripCustomer} = useTrip();
  const {api_key_google} = useAuth()

  const getTripAsyncStorage = async () => {
    const trip = await AsyncStorage.getItem('trip');
    if (trip) {
      const tripJson = JSON.parse(trip);
      dispatchTripCustomer({
        type: 'update',
        field: 'destination',
        arg: tripJson.destination,
      });
    }
  };
  useEffect(() => {
    getTripAsyncStorage();
  }, []);
  return (
    <Modal visible={onVisible}>
      <HeaderModal
        style={{
          paddingTop: 20,
        }}
      >
        <TouchableOpacity onPress={() => setOnVisible(false)}>
          <Ionicons name="close" size={40} color="black" />
        </TouchableOpacity>
      </HeaderModal>
      <WebView
        renderLoading={() => (
          <>
            {' '}
            <ActivityIndicator
              size={'large'}
              color={theme.colors.primary}
            />{' '}
          </>
        )}
        source={{
          html: `
            <html>
            <head>
              <title>Street View split-map-panes</title>
              <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>

              <style>
              html,
              body {
                height: 100%;
                margin: 0;
                padding: 0;
              }
              #map {
                display: none;
              }
              #map,
              #pano {
                float: left;
                height: 100%;
                width: 100%;
              }
              </style>
            </head>
            <body>
              <div id="map"></div>
              <div id="pano"></div>

              <script
                src="https://maps.googleapis.com/maps/api/js?key=${
                  api_key_google || buildApp().HOST_API_GOOGLE_MAPS
                }&callback=initialize&v=weekly"
                defer
              ></script>
              <script>
              function initialize() {
                const fenway = { lat: ${latitude}, lng: ${longitude} };
                const map = new google.maps.Map(document.getElementById("map"), {
                  center: fenway,
                  zoom: 14,
                });
                const panorama = new google.maps.StreetViewPanorama(
                  document.getElementById("pano"),
                  {
                    position: fenway,
                    pov: {
                      heading: 34,
                      pitch: 10,
                    },
                    zoomControl: false,
                  }
                );

                map.setStreetView(panorama);
              }

              window.initialize = initialize;
              </script>
            </body>
          </html>

          `,
        }}
      />
    </Modal>
  );
};
