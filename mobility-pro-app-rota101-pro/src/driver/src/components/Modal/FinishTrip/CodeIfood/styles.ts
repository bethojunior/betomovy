import {Dimensions, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import theme from '../../../../styles/theme';

const {width} = Dimensions.get('window');
const inputWidth = (width - 120) / 4;

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.View`
  width: ${width - 50}px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 24px;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

export const AnimatedContainer = styled(Animated.View)`
  width: 100%;
`;

export const CardHeader = styled.View`
  margin-bottom: 8px;
  align-items: flex-start;
`;

export const CardTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: #1f2937;
  text-align: left;
`;

export const CardDescription = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: #6b7280;
  text-align: left;
  margin-bottom: 24px;
`;

export const CodeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

interface CodeInputProps {
  isFilled: boolean;
  isDisabled: boolean;
}

export const CodeInput = styled.TextInput<CodeInputProps>`
  width: ${inputWidth}px;
  height: 60px;
  border-width: 2px;
  border-color: ${props => (props.isFilled ? '#3B82F6' : '#D1D5DB')};
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  background-color: ${props =>
    props.isFilled ? '#EFF6FF' : props.isDisabled ? '#F3F4F6' : '#F9FAFB'};
  color: ${props => (props.isDisabled ? '#6B7280' : '#1F2937')};
  font-weight: bold;
`;

export const LoadingContainer = styled.View`
  background-color: ${theme.colors.background_black_light};
  border-radius: 8px;
  padding: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const TextButton = styled.Text`
  font-size: 16px;
  font-family: MavenPro_600SemiBold;
  color: ${({theme}) => theme.colors.primaryText};
  letter-spacing: 0.5px;
`;

export const styles = StyleSheet.create({
  otpContainer: {
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
    gap: 16,
  },

  otpPinCode: {
    width: 45,
    height: 60,
  },

  otpCodeText: {
    fontSize: 24,
    textAlign: 'center',
  },
});
