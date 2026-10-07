import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: 'column';
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const MarkerImageProfile = styled.Image`
  width: 25px;
  height: 25px;
  border-radius: 360px;
  position: absolute;
  z-index: 1000;
  left: 4.5px;
  top: 1px;
`