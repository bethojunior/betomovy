import { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { SuccessContainer, SuccessSubtitle, SuccessTitle } from './styles';

interface PixSuccessStateProps {
  title: string;
  subtitle: string;
}

export const PixSuccessState: FC<PixSuccessStateProps> = ({ title, subtitle }) => {
  const theme = useTheme();

  return (
    <SuccessContainer>
      <Ionicons name="checkmark-circle" size={RFValue(60)} color={theme.toast.success} />
      <SuccessTitle>{title}</SuccessTitle>
      <SuccessSubtitle>{subtitle}</SuccessSubtitle>
    </SuccessContainer>
  );
};

export default PixSuccessState;
