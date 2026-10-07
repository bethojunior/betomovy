import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import { lighten } from 'polished';

interface ColorProps {
  color?: string;
}

interface BallProps {
  color?: string;
}

interface ButtonProps{
  isDisabled?: boolean;
}

export const ButtonsHelp = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  align-self: center;
  padding: 20px 0;
`;

export const ContainerAddress = styled.View`
  flex-direction: row;
  align-items: center;
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
  padding: 10px 0;
`;

export const ContainerFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({theme}) => theme.spacing.medium}px;
  padding: 0 10px;
`;

export const ContainerModal = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background_global};
  flex: 1;
  padding: 0 ${({theme}) => theme.spacing.xlarge}px;
`;

export const ContainerText = styled.View`
  margin-top: 5px;
`;

export const Content = styled.View`
  margin-top: ${({theme}) => theme.spacing.medium}px;
  flex-direction: column;
`;

export const HeaderCardContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 0.1px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const Subtitle = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const TextSmall = styled.Text<ColorProps>`
  color: ${({color, theme}) => color || theme.colors.secondary};
  font-size: 12px;
`;

export const TextTitle = styled.Text`
  color: ${({theme}) => theme.colors.black};
  text-transform: uppercase;
  font-size: ${({theme}) => theme.fontSizes.large}px;
`;

export const MapContent = styled.View`
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.background_global};
  height: 150px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

export const DriverContent = styled.View`
  flex-direction: row;
  padding: 10px 10px 0 10px;
  width: 100%;
`;

export const ContentDriverInfo = styled.View`
  align-items: center;
  width: 80%;
`;

export const DriverName = styled.Text`
  font-size: 18px;
  align-self: center;
  text-align: center;
  color: ${({theme}) => theme.colors.secondary};
`;

export const SectionDriver = styled.View`
  flex-direction: row;
  width: 90%;
  justify-content: space-around;
`;

export const Column = styled.View`
  align-items: center;
  margin-top: 10px;
`;

export const AddressContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px 10px 20px 0;
  margin-top: 10px;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  border-top-width: 0.5px;
  border-top-color: ${({theme}) => theme.colors.primary};
`;

export const Ball = styled.View<BallProps>`
  background-color: ${({theme, color}) =>
    color === 'primary' ? theme.colors.primary : theme.colors.secondary};
  border-radius: 100px;
  width: 10px;
  height: 10px;
  align-self: center;
`;

export const Square = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  width: 10px;
  height: 10px;
  align-self: center;
`;

export const Line = styled.View`
  border-width: 0.8px;
  border-color: ${({theme}) => theme.colors.primary};
  flex: 1;
  width: 1px;
  align-self: center;
  border-style: dashed;
  min-height: 20px;
`;

export const Address = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  margin-bottom: 10px;
`;

export const Destiny = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const Buton = styled(Button)<ButtonProps>`
  background-color: ${({theme, isDisabled}) => isDisabled ? lighten(0.2, theme.colors.primary) : theme.colors.primary};
  border-radius: 5px;
  width: 45%;
`;
