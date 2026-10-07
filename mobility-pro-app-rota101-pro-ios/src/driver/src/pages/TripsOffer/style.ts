import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const ContainerCard = styled.ScrollView`
  flex: 1;
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const WithoutTripText = styled.Text`
  text-align: center;
`
