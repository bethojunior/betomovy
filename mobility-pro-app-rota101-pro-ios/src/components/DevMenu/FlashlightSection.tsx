import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useFlashlight } from '~/hooks/useFlashlight';
import { useTheme } from 'styled-components/native';
import {
  SectionWrapper,
  SectionLabel,
  Group,
  Row,
  ActionRow,
  Label,
  ValueText,
  ActionLabel,
  Badge,
  BadgeText,
  colors as menuColors,
} from './styles';

const BLINK_DURATION_MS = 5000;
const BLINK_ON_MS = 400;
const BLINK_OFF_MS = 600;

export const FlashlightSection = () => {
  const { colors } = useTheme();
  const { enableTorch, blink, stop } = useFlashlight();
  const [isBlinking, setIsBlinking] = useState(false);

  const handleTestBlink = () => {
    setIsBlinking(true);
    blink(BLINK_ON_MS, BLINK_OFF_MS);
    setTimeout(() => {
      stop();
      setIsBlinking(false);
    }, BLINK_DURATION_MS);
  };

  const handleStop = () => {
    stop();
    setIsBlinking(false);
  };

  return (
    <SectionWrapper>
      <SectionLabel>Lanterna</SectionLabel>
      <Group>
        <Row>
          <Label>Estado da lanterna</Label>
          <Badge ok={enableTorch}>
            <BadgeText>{enableTorch ? 'Ligada' : 'Desligada'}</BadgeText>
          </Badge>
        </Row>

        {!isBlinking && (
          <ActionRow last onPress={handleTestBlink}>
            <MaterialIcons name="flashlight-on" size={16} color={menuColors.blue} />
            <ActionLabel>Testar ({BLINK_DURATION_MS / 1000}s)</ActionLabel>
          </ActionRow>
        )}

        {isBlinking && (
          <ActionRow last danger onPress={handleStop}>
            <MaterialIcons name="stop" size={16} color={colors.red} />
            <ActionLabel danger>Parar</ActionLabel>
          </ActionRow>
        )}
      </Group>
    </SectionWrapper>
  );
};
