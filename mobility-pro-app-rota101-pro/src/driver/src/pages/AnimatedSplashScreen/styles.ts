import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
  justify-content: center;
  align-items: center;
`;

export const VersionText = styled.Text`
  color: black;
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  bottom: 50px;
  align-self: center;
  padding: 10px;
  z-index: 999;
`;
