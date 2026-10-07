import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: ${({theme}) => theme.spacing.large}px;
  background: ${({theme}) => theme.colors.background_global};
`;

export const ContainerCard = styled.ScrollView`
  flex: 1;
  margin-top: ${({theme}) => theme.spacing.large}px;
`;
