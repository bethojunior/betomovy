import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: ${({theme}) => theme.spacing.large}px;
  background: ${({theme}) => theme.colors.background_global};
`;

export const TextDescription = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;
export const TextButton = styled.Text`
  text-transform: capitalize;
  color: ${({theme}) => theme.colors.primary};
`;

export const ContentVehicle = styled.ScrollView`
  flex: 1;
  margin-top: ${({theme}) => theme.spacing.large}px;
  flex-direction: column;
`;

export const ContainerButton = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  justify-content: space-around;
  flex-direction: row;
`;
