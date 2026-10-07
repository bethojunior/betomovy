import styled from 'styled-components/native';

interface SectionProps {
  removeBorder?: boolean;
}

interface ButtonProps {
  disabled: boolean;
  size?: number;
}

export const Content = styled.View`
  border-color: ${({theme}) => theme.colors.primary};
  border-width: 1px;
  border-radius: 5px;
  padding-bottom: 5px;
  margin-bottom: 15px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

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

export const SubTitle = styled.Text<{size?: number}>`
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({size}) => (size ? size : 14)}px;
`;

export const ButtonText = styled.Text<ButtonProps>`
  font-family: MavenPro_400Regular;
  font-size: ${({size}) => (size ? size : 13)}px;
  color: ${({theme, disabled}) =>
    disabled ? theme.colors.secondary : theme.colors.primaryText};
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
