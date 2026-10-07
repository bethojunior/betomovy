import styled from 'styled-components/native';

export const Container = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

export const MarginLeft = styled.TouchableOpacity`
  margin-left: 5px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  max-width: 70%;
  color: ${({theme}) => theme.colors.black};
  font-family: MavenPro_400Regular;
`;

export const ContainerRow = styled.View`
  flex-direction: row;
  align-items: center;
`;
