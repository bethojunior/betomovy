import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_black_light};
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xlarge}px;
`;

export const AlertContainer = styled.View`
  width: 100%;
  max-width: ${RFValue(340)}px;
  padding: ${({ theme }) => theme.spacing.xlarge}px;
  border-radius: ${({ theme }) => theme.borderRadius.xlarge}px;
  background-color: ${({ theme }) => theme.colors.white};
  align-items: center;

  shadow-color: ${({ theme }) => theme.colors.black};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  elevation: 8;
`;

export const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: ${({ theme }) => theme.spacing.medium}px;
  right: ${({ theme }) => theme.spacing.medium}px;
  width: ${RFValue(28)}px;
  height: ${RFValue(28)}px;
  border-radius: ${RFValue(14)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const AnimationContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

export const FoxImage = styled.Image`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
`;

export const Title = styled.Text`
  font-family: MavenPro_600SemiBold;
  font-size: ${RFValue(18)}px;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
  padding: 0 ${({ theme }) => theme.spacing.small}px;
  text-align: center;
  color: ${({ theme }) => theme.colors.red};
`;

export const SubTitle = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: ${RFValue(14)}px;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
  padding: 0 ${({ theme }) => theme.spacing.small}px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const PermissionsList = styled.View`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
  padding: 0 ${({ theme }) => theme.spacing.medium}px;
`;

export const PermissionText = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.text_gray};
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

export const ButtonsContainer = styled.View`
  width: 100%;
`;

export const AlertButton = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding-vertical: ${({ theme }) => theme.spacing.large}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const AlertButtonText = styled.Text`
  font-family: MavenPro_600SemiBold;
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.colors.primaryText};
`;

export const LoadingOverlay = styled.View`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -${RFValue(20)}px;
  margin-top: -${RFValue(20)}px;
`;
