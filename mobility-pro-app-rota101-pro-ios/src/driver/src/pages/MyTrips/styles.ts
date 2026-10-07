import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  height: 100%;
  padding: 0 ${({theme}) => theme.spacing.large}px;
  padding: ${({theme}) => theme.spacing.large}px;
  background: ${({theme}) => theme.colors.background_global};
`;

export const ContainerCards = styled.ScrollView``;

export const TextNone = styled.Text`
  text-align: center;
  color: ${({theme}) => theme.colors.secondary};
  font-family: ${({theme}) => theme.fonts.regular};
`;
