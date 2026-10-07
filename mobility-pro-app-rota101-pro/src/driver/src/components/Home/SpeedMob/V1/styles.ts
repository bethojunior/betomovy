import styled from "styled-components/native";

import { RFValue } from "react-native-responsive-fontsize";

export const ContentButton = styled.View`
  align-items: center;
  position: absolute;
  bottom: ${RFValue(0)}px;
  width: 100%;

  padding: 0 20px 20px 20px;

  background-color: ${({theme}) => theme.colors.background_global};

  elevation: 5;

  shadow-color: ${({theme}) => theme.colors.black};
  shadow-opacity: 0.25;
`;

export const ContainerHeader = styled.View`
  position: relative;

  margin: ${({theme}) => theme.spacing.large}px 0;
`;

export const ContainerIcon = styled.TouchableOpacity`
  position: absolute;
  top: -${({theme}) => theme.spacing.xsslarge}px;
  border-radius: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;

  margin-bottom: 20px;

  shadow-color: ${({theme}) => theme.colors.black};
  shadow-opacity: 0.25;
`;

export const Icon = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  height: 50px;
  width: 50px;

  align-items: center;
  justify-content: center;
`;

export const ContainerText = styled.View`
  margin-top: ${({theme}) => theme.spacing.xlarge}px;
`;
