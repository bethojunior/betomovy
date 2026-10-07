import {ActivityIndicator} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import WebView from 'react-native-webview';
import theme from '../../styles/theme';
import {
  ContainerAddress,
  Content,
  ContentCloseIcon,
  HeaderModal,
  TextTitle,
} from './styles';
import {buildApp} from '../../../../constantBuild/config';
import {translate} from '../../../../client/locales';
import {useEffect, useState} from 'react';
import ProgressActivityIndicator from '../ProgressActivityIndicator';
import {useAuth} from '../../../../context/auth';

interface Props {
  destiny?: string;
  setOnVisible: (value: boolean) => void;
  latitude?: number;
  longitude?: number;
  loading?: boolean;
}

export const WebviewMapCoordinate = ({
  destiny,
  setOnVisible,
  latitude,
  longitude,
}: Props) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const {api_key_google} = useAuth();

  useEffect(() => {
    if (loadingProgress < 100) {
      const timer = setTimeout(() => {
        setLoadingProgress(prevProgress => prevProgress + 10);
      }, 1000); // Isso aumentará a porcentagem em 10% a cada segundo

      return () => clearTimeout(timer); // Limpando o timer quando o componente é desmontado
    }
  }, [loadingProgress]);
  return (
    <HeaderModal
      style={{
        shadowColor: theme.colors.black,
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.3,

        elevation: 13,
      }}
    >
      <Content>
        <ContentCloseIcon onPress={() => setOnVisible(false)}>
          <Ionicons name="close" size={40} color={theme.colors.primaryText} />
        </ContentCloseIcon>
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
          onLoadEnd={() => setLoadingProgress(100)}
        />

        <ContainerAddress>
          {loadingProgress < 100 && (
            <ProgressActivityIndicator
              progress={loadingProgress}
              size="large"
              color={theme.colors.primary}
            />
          )}
          <TextTitle>
            {translate('tripDriver.destiny')} {destiny}
          </TextTitle>
        </ContainerAddress>
      </Content>
    </HeaderModal>
  );
};
