import { useEffect, useState } from 'react';
import { Clipboard } from 'react-native';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
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
  colors as menuColors,
} from './styles';

type Position = { latitude: number; longitude: number; heading: number | null };

export const LocationSection = () => {
  const { colors } = useTheme();
  const [position, setPosition] = useState<Position | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setPosition(loc.coords);
    };

    fetch();
  }, []);

  const coordsString = position
    ? `${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`
    : null;

  const handleCopy = () => {
    if (!coordsString) return;
    Clipboard.setString(coordsString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SectionWrapper>
      <SectionLabel>Localização</SectionLabel>
      <Group>
        <Row>
          <Label>Latitude</Label>
          <ValueText>
            {position ? position.latitude.toFixed(6) : '-'}
          </ValueText>
        </Row>

        <Row>
          <Label>Longitude</Label>
          <ValueText>
            {position ? position.longitude.toFixed(6) : '-'}
          </ValueText>
        </Row>

        <Row last={!position}>
          <Label>Direção (heading)</Label>
          <ValueText>
            {position ? `${position.heading?.toFixed(1) ?? '—'}°` : '-'}
          </ValueText>
        </Row>

        {position && (
          <ActionRow last onPress={handleCopy}>
            <MaterialIcons
              name={copied ? 'check' : 'content-copy'}
              size={16}
              color={copied ? colors.serene_green : menuColors.blue}
            />
            <ActionLabel style={copied ? { color: colors.serene_green } : undefined}>
              {copied ? 'Copiado!' : 'Copiar coordenadas'}
            </ActionLabel>
          </ActionRow>
        )}
      </Group>
    </SectionWrapper>
  );
};
