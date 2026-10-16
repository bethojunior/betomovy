import { memo, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDevTools, SIMULATION_ROUTE } from '../../context/DevTools';
import { useUserDriver } from '../../context/userDriver';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { buildApp } from '../../../../constantBuild/config';
import { getProfileImageUrl } from '../../utils/imageUrl';
import {
  Container,
  InfoGroup,
  TitleRow,
  Dot,
  Title,
  Subtitle,
  ProgressBlock,
  ProgressCount,
  ProgressTotal,
  ProgressLabel,
  StopButton,
} from './styles';

interface SimulationOverlayProps {
  visible: boolean;
}

const PulseDot = memo(() => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.25, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
    return () => opacity.stopAnimation();
  }, [opacity]);

  return <Dot style={{ opacity }} />;
});

export const SimulationOverlay = memo(({ visible }: SimulationOverlayProps) => {
  const { simulation, stopSimulation } = useDevTools();
  const { userDriverFind } = useUserDriver();
  const { getStoragePictureSpecific } = useStoragePictures();

  if (!visible) return null;

  const avatarUri = getProfileImageUrl(
    userDriverFind?.profileImage,
    getStoragePictureSpecific('driver'),
    buildApp().HOST_IMAGE_DRIVER,
  );

  return (
    <Container>
      <InfoGroup>
        <TitleRow>
          <PulseDot />
          <Title>Simulação</Title>
        </TitleRow>
        <Subtitle>Rota ativa</Subtitle>
      </InfoGroup>

      <ProgressBlock>
        <ProgressCount>
          {simulation.index + 1}
          <ProgressTotal>/{SIMULATION_ROUTE.length}</ProgressTotal>
        </ProgressCount>
        <ProgressLabel>pontos</ProgressLabel>
      </ProgressBlock>

      <StopButton
        onPress={() => stopSimulation()}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        <MaterialIcons name="stop" size={17} color="#FFFFFF" />
      </StopButton>
    </Container>
  );
});
