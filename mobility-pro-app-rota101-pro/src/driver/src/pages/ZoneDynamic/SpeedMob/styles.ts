import styled from 'styled-components/native';

interface PropsButton {
  selected?: boolean;
  colorBorder?: string;
}

export const Container = styled.View`
  flex: 1;
  position: relative;
  background: ${({theme}) => theme.colors.background_global};
`;

export const Header = styled.View<{ backgroundColor: string }>`
    width: 100%;
    height: 100px;
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.backgroundColor};
    padding: 0 10px;
`

export const ButtonBack = styled.TouchableOpacity``

export const TitleHeader = styled.Text<{ colorText: string }>`
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: ${props => props.colorText};
    flex: 1;
`

export const ContainerCards = styled.ScrollView``;

export const TextNone = styled.Text`
  text-align: center;
  color: ${({theme}) => theme.colors.secondary};
  font-family: ${({theme}) => theme.fonts.regular};
`;

export const ContainerIcon = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 20px;
`;
export const ContainerIconCentralize = styled.View`
  position: absolute;
  bottom: 0;
  right: 50%;
  margin: 20px;
  flex-direction: row;
`;

export const ButtonCard = styled.TouchableOpacity<PropsButton>`
  padding: ${({theme}) => theme.spacing.medium}px;
  align-items: center;
  justify-content: center;
  background: ${({theme, selected}) =>
    selected ? theme.colors.primary : theme.colors.background_global};

  margin: ${({theme}) => theme.spacing.small}px 0;
  border: 1px solid ${props => props.colorBorder ? props.colorBorder : ({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.spacing.medium}px;
`;

export const ContainerButton = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
`;
