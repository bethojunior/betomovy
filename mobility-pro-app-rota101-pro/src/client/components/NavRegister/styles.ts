import {Dimensions} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: ${({theme}) => theme.spacing.medium}px;
  padding-right: ${({theme}) => theme.spacing.medium}px;
  /* background: ${({theme}) => theme.colors.primary}; */
  height: ${RFValue(45)}px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.primary};
  position: absolute;
  width: ${Dimensions.get('window').width}px;
  text-align: center;
`;

export const IconMoney = styled.Image.attrs({
  resizeMode: 'stretch',
})`
  height: ${RFValue(25)}px;
  width: ${RFValue(25)}px;
  margin-right: ${RFValue(8)}px;
`;
