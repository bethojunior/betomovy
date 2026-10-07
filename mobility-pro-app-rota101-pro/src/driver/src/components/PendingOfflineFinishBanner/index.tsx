import { memo, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { translate } from '../../../../client/locales';
import { useOfflineTripActions } from '~/hooks/useOfflineTripActions';
import {
  Container,
  InfoGroup,
  TitleRow,
  Dot,
  Title,
  Subtitle,
  CountBlock,
  CountValue,
  CountLabel,
} from './styles';

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

export const PendingOfflineFinishBanner = () => {
  const { pendingFinishActions } = useOfflineTripActions();

  if (pendingFinishActions.length === 0) return null;

  return (
    <Container>
      <InfoGroup>
        <TitleRow>
          <PulseDot />
          <Title>{translate('offlineSync.finishing_trip')}</Title>
        </TitleRow>
        <Subtitle>{translate('offlineSync.syncing_with_server')}</Subtitle>
      </InfoGroup>

      <CountBlock>
        <CountValue>{pendingFinishActions.length}</CountValue>
        <CountLabel>{translate('offlineSync.in_queue')}</CountLabel>
      </CountBlock>
    </Container>
  );
};
