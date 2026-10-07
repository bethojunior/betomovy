import styled from "styled-components/native";
interface ButtonTripPreAcceptedProps {
    visible: boolean;
  }
export const ButtonTripPreAccepted = styled.TouchableOpacity<ButtonTripPreAcceptedProps>`
  position: absolute;
  top: 140px;
  background-color: ${({theme}) => theme.colors.primary};
  height: 35px;
  elevation: 10;
  width: 50%;
  z-index: 1;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: ${({visible}) => (visible ? 'flex' : 'none')};
`;

export const PreAcceptedContent = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100%;
`;

export const TextPreAccepted = styled.Text`
  font-family: MavenPro_400Regular;
  margin-top: -1px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.background_global};
`;
