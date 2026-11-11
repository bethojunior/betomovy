import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(Animated.View)`
  width: 100%;
  align-items: center;
  border-top-left-radius: ${RFValue(25)}px;
  border-top-right-radius: ${RFValue(25)}px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.white ?? '#FFFFFF'};
  shadow-color: ${({ theme }) => theme.colors.black};
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 8;
`;

export const Handle = styled.View`
  align-self: center;
  width: ${RFValue(40)}px;
  height: ${RFValue(4)}px;
  border-radius: ${RFValue(2)}px;
  background-color: ${({theme}) => theme.colors.gray_border ?? '#E2E8F0'};
  margin-top: ${({theme}) => theme.spacing.medium}px;
  margin-bottom: ${({theme}) => theme.spacing.small}px;
`;

export const Header = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const GoBackButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-left: 20px;
  margin-bottom: 10px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-weight: 600;

  margin-top: 10px;
  text-align: center;

  color: ${({theme}) => theme.colors.secondary};
`;

export const CenterContentContainer = styled.View`
  width: 100%;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xsslarge}px 0;
`;

export const IconContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const DotContainer = styled.View`
  flex-direction: row;
`;

export const LoadingLineAnimation = styled(LottieView)`
  width: 100%;
`;

export const StatusAnimation = styled(LottieView)`
  width: ${RFValue(150)}px;
  height: ${RFValue(150)}px;
`;

export const ButtonCancel = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  height: ${RFValue(44)}px;
  width: ${RFValue(200)}px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  margin-bottom: ${RFValue(16)}px;
`;

export const TextCancel = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: 18px;
`;