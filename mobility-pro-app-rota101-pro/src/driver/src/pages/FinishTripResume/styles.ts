import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled.View`
  background-color: #f6f7f9;
  padding: 20px;
  gap: 20px;
`;

export const ConfirmButtonResumeTrip = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  height: 56px;
  border-radius: 14px;
  margin-top: 28px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const FixedFooter = styled.View`
  width: 100%;
  background-color: #ffffff;
  padding: 20px;

  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.08;
  shadow-radius: 4px;
  elevation: 10;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const TextButton = styled.Text`
  font-size: 16px;
  font-family: MavenPro_600SemiBold;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const Title = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: MavenPro_600SemiBold;
  color: #1f2933;
  text-align: center;
  margin-bottom: 12px;
`;
