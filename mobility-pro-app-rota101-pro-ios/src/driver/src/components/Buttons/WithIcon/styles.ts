import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

interface IconProps {
  avatar?: boolean;
}

interface TitleProps {
  titleBold: boolean;
}

export const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 13px 15px;
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  margin: 0 15px;
`;

export const ContentRow = styled.View`
  margin: 7px 0;
`;

export const Title = styled.Text<TitleProps>`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({titleBold}) =>
    titleBold ? 'MavenPro_600SemiBold' : 'MavenPro_400Regular'};
`;

export const TitleCode = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(13)}px;
  font-family: MavenPro_400Regular;
`;

export const SubTitle = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
  font-size: 16px;
`;

export const IconContent = styled.View<IconProps>`
  ${({avatar}) =>
    !avatar &&
    css`
      height: 25px;
      max-height: 25px;
      width: 25px;
      max-width: 25px;
      align-items: center;
      justify-content: center;
    `};
`;

export const DriverInfo = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
  font-size: 15px;
`;

export const Section = styled.View`
  flex-direction: row;
  justify-content: flex-start;
`;

export const SubSection = styled.View`
  flex-direction: row;
  align-items: center;
`;
