import styled from 'styled-components/native';

interface ColorProps {
  color?: string;
}

export const ContainerCard = styled.TouchableOpacity`
  align-self: center;
  display: flex;
  flex-direction: column;
  padding: ${({theme}) => theme.spacing.xlarge}px;
  margin: ${({theme}) => theme.spacing.large}px;
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.primary};
  width: 100%;
`;

export const ContainerText = styled.View`
  margin-top: 5px;
`;

export const ContainerModal = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background_global};
  flex: 1;
  padding: 0 ${({theme}) => theme.spacing.xlarge}px;
`;

export const HeaderCard = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const TextTitle = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  text-transform: uppercase;
  font-size: ${({theme}) => theme.fontSizes.large}px;
`;

export const DateCard = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
export const Subtitle = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;
export const TextSmall = styled.Text<ColorProps>`
  color: ${({color, theme}) => color || theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.small}px;
`;

export const Content = styled.View`
  margin-top: ${({theme}) => theme.spacing.medium}px;
  flex-direction: column;
`;

export const ContainerAddress = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ContainerFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const TextBold = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContainerButton = styled.View`
  margin-top: ${({theme}) => theme.spacing.xlarge}px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ButtonsHelp = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const ContainerDialog = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  padding: 10px 0;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const HeaderCardContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 0.1px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;
