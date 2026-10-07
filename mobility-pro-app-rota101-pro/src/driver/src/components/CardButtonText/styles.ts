import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';
import {USE_DARK_PRIMARY_VARIANT} from '../../../../constantBuild/config';

export const ButtonSend = styled.TouchableOpacity<{appType?: string}>`
  width: 100%;
  margin: 8px 0;
  background-color: ${({appType}) =>
    appType === 'waze' ? '#00D4FF' : appType === 'google' ? '#4285F4' : '#fff'};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  height: ${RFValue(50)}px;
  padding: 0 24px;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 6;
  ${USE_DARK_PRIMARY_VARIANT &&
  css`
    border: 0.5px solid ${({theme}) => theme.colors.black};
  `}
`;

export const TextCard = styled.Text<{appType?: string}>`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({appType}) =>
    appType === 'waze' || appType === 'google' ? '#fff' : '#333'};
  font-family: MavenPro_600SemiBold;
  text-align: left;
  font-weight: 600;
`;

export const LogoContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  margin-right: 16px;
`;

export const ContentContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const IconContainer = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.background_white_light};
`;
