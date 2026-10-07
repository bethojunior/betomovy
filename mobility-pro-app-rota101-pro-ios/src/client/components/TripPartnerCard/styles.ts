import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  margin-top: 20px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #d8d8d8;
`;

export const ClientSection = styled.View`
  margin-left: 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

export const NameClient = styled.Text`
  font-family: MavenPro_600SemiBold;
  font-size: 14px;
  max-width: 90%;
  color: ${({theme}) => theme.colors.primary};
`;

export const ButtonSection = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #d8d8d8;
  padding-bottom: 10px;
  justify-content: space-around;
`;

export const ButtonMessage = styled.TouchableOpacity`
  border-width: 0.5px;
  border-color: ${({theme}) => theme.colors.secondary};
  padding: 6px;
  border-radius: 5px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

export const TextMessage = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
  font-size: 13px;
`;

export const ButtonCancel = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 5px;
  background-color: ${({theme, disabled}) =>
    theme.colors.primary + (disabled ? '50' : '')};
  justify-content: center;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  width: 100%;
`;

export const TextCancel = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-family: MavenPro_500Medium;
  font-size: 14px;
`;

export const TitleInfo = styled.Text`
  margin-top: 5px;
  font-family: MavenPro_500Medium;
  font-size: 13px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Info = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: 15px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const RowStyle = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ImageClient = styled.Image`
  width: ${RFValue(60)}px;
  height: ${RFValue(60)}px;
  border-radius: ${RFValue(60)}px;
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
  margin-right: ${({theme}) => theme.spacing.medium}px;
`;
