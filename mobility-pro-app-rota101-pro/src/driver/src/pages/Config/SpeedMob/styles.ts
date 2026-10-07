import styled from 'styled-components/native';

interface SectionProps {
  removeBorder?: boolean;
}

interface ButtonProps {
  disabled: boolean;
}

export const Content = styled.View`
  border-color: ${({theme}) => theme.colors.primary};
  border-width: 1px;
  border-radius: 5px;
  padding-bottom: 5px;
  margin-bottom: 15px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const HeaderSpeedMob = styled.View<{ backgroundColor: string }>`
    width: 100%;
    height: 100px;
    padding: 0 10px;
    flex-direction: row;
    align-items: center;
    background-color: ${({theme}) => theme.colors.primary};
    margin-bottom: 10px;
`

export const TitleHeaderSpeedMob = styled.Text`
    font-size: 20px;
    flex: 1;
    text-align: center;
    font-weight: bold;
    color: ${({theme}) => theme.colors.background_global};
`

export const ButtonBack = styled.TouchableOpacity``

export const Header = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  width: 100%;
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 16px;
  margin-left: 10px;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.background_global};
`;

export const Section = styled.View<SectionProps>`
  padding: 3px 10px 3px 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  width: 100%;
  border-bottom-width: ${({removeBorder}) => (removeBorder ? 0 : '1px')};
`;

export const SubTitle = styled.Text`
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.secondary};
  font-size: 14px;
`;

export const ButtonText = styled.Text<ButtonProps>`
  font-family: MavenPro_400Regular;
  font-size: 13px;
  color: ${({theme, disabled}) =>
    disabled ? theme.colors.secondary : theme.colors.background_global};
`;

export const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({disabled, theme}) =>
    disabled ? 'transparent' : theme.colors.primary};
  border-color: ${({theme}) => theme.colors.primary};
  border-width: 0.5px;
  padding: 5px;
  border-radius: 5px;
  width: 65px;
  align-items: center;
`;

// MavenPro_400Regular,
// MavenPro_500Medium,
