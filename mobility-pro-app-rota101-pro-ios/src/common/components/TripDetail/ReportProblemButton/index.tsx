import { FC } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { ReportProblemButtonProps } from './types';
import { Button, Text } from './styles';

export const ReportProblemButton: FC<ReportProblemButtonProps> = ({ label, onPress }) => {
  const theme = useTheme();

  return (
    <Button activeOpacity={0.7} onPress={onPress}>
      <FontAwesome5 name="exclamation-circle" size={RFValue(14)} color={theme.colors.white} />
      <Text>{label}</Text>
    </Button>
  );
};
