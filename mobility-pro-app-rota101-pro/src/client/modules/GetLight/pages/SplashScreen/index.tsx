// @ts-nocheck

import {useNavigation} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {ActivityIndicator, Modal, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useLocal} from '../../../../contexts/local';
import {useTrip} from '../../../../contexts/Trip';
import logo from '../../../../../../assets/logo.png';
import {
  Container,
  ContainerImage,
  ContainerTitle,
  Image,
  Subtitle,
  Title,
} from './styles';
import theme from '../../../../styles/theme';
import Preload from '../../../../components/Preload';
import {translate} from '../../../../locales';
import {useTripGL} from '../../../../contexts/TripGL';
import {useModules} from '../../../../contexts/modules';

export function HomeGetLight({visible}) {
  const {setVisibleLookUpAddressesModal} = useTripGL();
  const {position} = useLocal();
  const [loadingCardAd, setLoadingCardAd] = useState(true);
  const unic = useRef(true);
  const {modulesActives} = useModules();

  return (
    <>
      <Modal visible={visible}>
        <Container>
          <ContainerImage>
            <Image
              source={{
                uri:
                  modulesActives.find(el => el.moduleName === 'GetLight')
                    ?.logo || theme.images.logo,
              }}
            />
          </ContainerImage>
          <ContainerTitle>
            <Subtitle>{translate('schedule.loading')}</Subtitle>
            <ActivityIndicator size={'small'} color={theme.colors.primary} />
          </ContainerTitle>
        </Container>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.border_green,
  },
});
