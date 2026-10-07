import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  position: absolute;
  top: 140px;
  background-color: ${({theme}) => theme.colors.primary};
  height: 35px;
  z-index: 1;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  flex-direction: row;
  align-items: center;
  padding: 0px 10px 0px 10px
`;

export const ActiveTripText = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.background_global};
`;
