import styled from 'styled-components/native';
import theme from '../../styles/theme';

export const Container = styled.View`
  flex: 1;
  padding: ${theme.spacing.xsslarge}px 0;
  background-color: ${theme.colors.background_global};
  position: relative;
`;

export const Image = styled.Image`
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
`;

export const ContainerButton = styled.View`
  position: absolute;
  bottom: 60px;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
`;
