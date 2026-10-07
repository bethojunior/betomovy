import { FC } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { NetValueCardProps } from './types';
import { Caption, Card, IconWrapper, Label, TextBlock, Value } from './styles';

export const NetValueCard: FC<NetValueCardProps> = ({ label, caption, valueLabel }) => {
  const theme = useTheme();

  return (
    <Card>
      <IconWrapper>
        <FontAwesome5 name="wallet" size={RFValue(16)} color={theme.colors.border_green} />
      </IconWrapper>

      <TextBlock>
        <Label>{label}</Label>
        <Caption>{caption}</Caption>
      </TextBlock>

      <Value>{valueLabel}</Value>
    </Card>
  );
};
