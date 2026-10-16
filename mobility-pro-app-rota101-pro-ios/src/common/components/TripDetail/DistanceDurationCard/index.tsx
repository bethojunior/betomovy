import { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { DistanceDurationCardProps } from './types';
import { Card, Caption, Column, Divider, IconWrapper, TextBlock, Value } from './styles';

export const DistanceDurationCard: FC<DistanceDurationCardProps> = ({
  distanceLabel,
  distanceCaption,
  durationLabel,
  durationCaption,
}) => {
  const theme = useTheme();

  return (
    <Card>
      <Column>
        <IconWrapper>
          <Ionicons name="location-outline" size={RFValue(16)} color={theme.colors.primary} />
        </IconWrapper>
        <TextBlock>
          <Value>{distanceLabel}</Value>
          <Caption>{distanceCaption}</Caption>
        </TextBlock>
      </Column>

      <Divider />

      <Column>
        <IconWrapper>
          <Ionicons name="time-outline" size={RFValue(16)} color={theme.colors.primary} />
        </IconWrapper>
        <TextBlock>
          <Value>{durationLabel}</Value>
          <Caption>{durationCaption}</Caption>
        </TextBlock>
      </Column>
    </Card>
  );
};
