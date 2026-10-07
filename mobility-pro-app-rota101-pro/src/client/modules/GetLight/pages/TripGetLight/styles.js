import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ContainerModal = styled.View`
  width: 100%;
  height: 100%;
  padding: ${({theme}) => theme.spacing.xlarge}px;
`;
