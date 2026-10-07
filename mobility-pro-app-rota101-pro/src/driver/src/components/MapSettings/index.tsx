import {useEffect, useState} from 'react';
import {
  MapSettingButton,
  MapSettingContainer,
  MapSettingContent,
  MapSettingModal,
  MapSettingSaveButton,
  MapSettingTextInput,
} from './styles';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';

const key = 'mapSettings';

export function useMapSettings() {
  const [speedToMoveCamera, setSpeedToMoveCamera] = useState(2);
  const [metersToMoveCamera, setMetersToMoveCamera] = useState(0);
  const [zoomInTrip, setZoomInTrip] = useState(16);
  const [zoomOutTrip, setZoomOutTrip] = useState(13);
  const [pitch, setPitch] = useState(65);
  const [outPitch, setOutPitch] = useState(0);
  const [markerSize, setMarkerSize] = useState(46);
  const [markerSizeOut, setMarkerSizeOut] = useState(46);
  const [polylineWidth, setPolylineWidth] = useState(12);
  const [distanceMap, setDistanceMap] = useState(300);

  const saveSettingMap = async ({
    speedToMoveCameraTemp,
    metersToMoveCameraTemp,
    zoomInTripTemp,
    zoomOutTripTemp,
    pitchTemp,
    outPitchTemp,
    markerSizeTemp,
    markerSizeOutTemp,
    polylineWidthTemp,
    distanceMapTemp,
  }) => {
    try {
      await AsyncStorage.setItem(
        key,
        JSON.stringify({
          speedToMoveCameraTemp,
          metersToMoveCameraTemp,
          zoomInTripTemp,
          zoomOutTripTemp,
          pitchTemp,
          outPitchTemp,
          markerSizeTemp,
          markerSizeOutTemp,
          polylineWidthTemp,
          distanceMapTemp,
        }),
      );

      setSpeedToMoveCamera(Number(speedToMoveCameraTemp));
      setMetersToMoveCamera(Number(metersToMoveCameraTemp));
      setZoomInTrip(Number(zoomInTripTemp) || 18);
      setZoomOutTrip(Number(zoomOutTripTemp) || 13);
      setPitch(Number(pitchTemp) || 65);
      setOutPitch(Number(outPitchTemp) || 0);
      setMarkerSize(Number(markerSizeTemp) || 30);
      setMarkerSizeOut(Number(markerSizeOutTemp) || 30);
      setPolylineWidth(Number(polylineWidthTemp) || 12);
      setDistanceMap(Number(distanceMapTemp) || 300);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  useEffect(() => {
    const getMapSettings = async () => {
      try {
        const dataStore = await AsyncStorage.getItem(key);

        if (dataStore) {
          const {
            speedToMoveCameraTemp,
            metersToMoveCameraTemp,
            zoomInTripTemp,
            zoomOutTripTemp,
            pitchTemp,
            outPitchTemp,
            markerSizeTemp,
            markerSizeOutTemp,
            polylineWidthTemp,
            distanceMapTemp,
          } = JSON.parse(dataStore);

          setSpeedToMoveCamera(Number(speedToMoveCameraTemp || 2));
          setMetersToMoveCamera(Number(metersToMoveCameraTemp) || 0);
          setZoomInTrip(Number(zoomInTripTemp));
          setZoomOutTrip(Number(zoomOutTripTemp));
          setPitch(Number(pitchTemp));
          setOutPitch(Number(outPitchTemp));
          setMarkerSize(Number(markerSizeTemp));
          setMarkerSizeOut(Number(markerSizeOutTemp));
          setPolylineWidth(Number(polylineWidthTemp) || 12);
          setDistanceMap(Number(distanceMapTemp) || 300);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    getMapSettings();
  }, []);

  return {
    speedToMoveCamera,
    metersToMoveCamera,
    zoomInTrip,
    pitch,
    saveSettingMap,
    zoomOutTrip,
    outPitch,
    markerSize,
    markerSizeOut,
    polylineWidth,
    distanceMap,
  };
}

export const MapSettingComponent = ({
  visible,
  setVisible,
  speedToMoveCamera,
  metersToMoveCamera,
  zoomInTrip,
  zoomOutTrip,
  pitch,
  outPitch,
  saveSettingMap,
  markerSize,
  markerSizeOut,
  polylineWidth,
  distanceMap,
}) => {
  const [speedToMoveCameraTemp, setSpeedToMoveCameraTemp] =
    useState(speedToMoveCamera);
  const [metersToMoveCameraTemp, setMetersToMoveCameraTemp] =
    useState(metersToMoveCamera);
  const [zoomInTripTemp, setZoomInTripTemp] = useState(zoomInTrip);
  const [zoomOutTripTemp, setZoomOutTripTemp] = useState(zoomOutTrip);
  const [pitchTemp, setPitchTemp] = useState(pitch);
  const [outPitchTemp, setOutPitchTemp] = useState(outPitch);
  const [markerSizeTemp, setMarkerSizeTemp] = useState(markerSize);
  const [markerSizeOutTemp, setMarkerSizeOutTemp] = useState(markerSizeOut);
  const [polylineWidthTemp, setPolylineWidthTemp] = useState(polylineWidth);
  const [distanceMapTemp, setDistanceMapTemp] = useState(distanceMap);

  const saveSettingMapTemp = () => {
    saveSettingMap &&
      saveSettingMap({
        speedToMoveCameraTemp,
        metersToMoveCameraTemp,
        zoomInTripTemp,
        zoomOutTripTemp: zoomOutTripTemp,
        outPitchTemp: outPitchTemp,
        pitchTemp,
        markerSizeTemp: markerSizeTemp,
        markerSizeOutTemp: markerSizeOutTemp,
        polylineWidthTemp: polylineWidthTemp,
        distanceMapTemp,
      });

    setVisible(false);
  };

  const backToDefault = () => {
    setSpeedToMoveCameraTemp(speedToMoveCamera);
    setMetersToMoveCameraTemp(metersToMoveCamera);
    setZoomInTripTemp(zoomInTrip);
    setZoomOutTripTemp(zoomOutTrip);
    setPitchTemp(pitch);
    setOutPitchTemp(outPitch);
    setMarkerSizeTemp(markerSize);
    setMarkerSizeOutTemp(markerSizeOut);
    setPolylineWidthTemp(polylineWidth);
    setDistanceMapTemp(distanceMap);
    setVisible(false);
  };

  const renderSlider = (
    value,
    setValue,
    title,
    minimumValue = 0,
    maximumValue = 100,
  ) => (
    <>
      <Text
        style={{
          color: '#fff',
          fontWeight: 'bold',
        }}
      >
        {title}
      </Text>
      <Slider
        style={{width: 200, height: 40}}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        value={value}
        onValueChange={setValue}
        step={1}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#fff"
      />
    </>
  );

  return (
    <MapSettingModal
      visible={visible}
      transparent
      statusBarTranslucent
      style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
      onRequestClose={() => setVisible(false)}
    >
      <MapSettingContainer>
        <MapSettingContent>
          {renderSlider(
            zoomInTripTemp,
            setZoomInTripTemp,
            'Zoom do mapa em corrida',
            0,
            30,
          )}
          {renderSlider(
            zoomOutTripTemp,
            setZoomOutTripTemp,
            'Zoom do mapa fora de corrida',
            0,
            30,
          )}
          {renderSlider(
            pitchTemp,
            setPitchTemp,
            'Ângulo do mapa em corrida',
            0,
            90,
          )}
          {renderSlider(
            outPitchTemp,
            setOutPitchTemp,
            'Ângulo do mapa fora de corrida',
            0,
            90,
          )}
          {renderSlider(
            markerSizeTemp,
            setMarkerSizeTemp,
            'Tamanho do marker do motorista em corrida',
            18,
            50,
          )}
          {renderSlider(
            markerSizeOutTemp,
            setMarkerSizeOutTemp,
            'Tamanho do marker do motorista fora de corrida',
            18,
            50,
          )}
          {renderSlider(
            polylineWidthTemp,
            setPolylineWidthTemp,
            'Largura da linha do trajeto',
            8,
            50,
          )}
          {renderSlider(
            distanceMapTemp,
            setDistanceMapTemp,
            'Distância do mapa em relação ao marker do motorista',
            -100,
            500,
          )}

          <View style={{marginBottom: 20, width: '100%'}}>
            <MapSettingSaveButton onPress={saveSettingMapTemp}>
              <Text>Salvar</Text>
            </MapSettingSaveButton>
          </View>
          <MapSettingSaveButton
            style={{
              width: '100%',
            }}
            onPress={backToDefault}
          >
            <Text>Cancelar</Text>
          </MapSettingSaveButton>
        </MapSettingContent>
      </MapSettingContainer>
    </MapSettingModal>
  );
};
