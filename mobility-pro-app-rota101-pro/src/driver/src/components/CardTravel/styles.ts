import styled from 'styled-components/native';

interface PropsHeader {
  color?: string;
}

export const ContainerCard = styled.TouchableOpacity`
  align-self: center;
  display: flex;
  flex-direction: column;
  padding: ${({theme}) => theme.spacing.xlarge}px;
  margin: ${({theme}) => theme.spacing.large}px;
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.background_white};
  width: 100%;
`;

export const ContainerModal = styled.View`
  flex: 1;
  padding: ${({theme}) => theme.spacing.xlarge}px;
`;

export const HeaderCard = styled.View<PropsHeader>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme, color}) =>
    !color ? theme.colors.border : color};
`;

export const ContentModal = styled.View`
  align-self: center;
  margin-bottom: 15px;
`;

export const TextTitle = styled.Text`
  text-transform: capitalize;
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const DateCard = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
export const Subtitle = styled.Text`
  margin-top: ${({theme}) => theme.spacing.small}px;
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
`;

export const Content = styled.View`
  display: flex;
  flex-direction: column;
`;

export const ContainerButton = styled.View`
  margin-top: ${({theme}) => theme.spacing.xlarge}px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ContainerDialog = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
`;
