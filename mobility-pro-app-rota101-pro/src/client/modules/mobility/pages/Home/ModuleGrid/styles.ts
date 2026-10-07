import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ModuleSection = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const ModuleRow = styled.View`
  flex-direction: row;
`;

export const ModuleButton = styled.TouchableOpacity`
  align-items: center;
  margin-right: ${({theme}) => theme.spacing.large}px;
`;

export const ModuleIconWrapper = styled.View`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  border-radius: ${RFValue(24)}px;
  background-color: ${({theme}) => `${theme.colors.primary}1A`};
  border-width: ${RFValue(2)}px;
  border-color: ${({theme}) => `${theme.colors.primary}4D`};
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const ModuleImage = styled.Image`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
`;

export const ModuleLabel = styled.Text`
  margin-top: ${RFValue(4)}px;
  font-size: ${RFValue(11)}px;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
`;

export const moduleRowContentStyle = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
}).content;
