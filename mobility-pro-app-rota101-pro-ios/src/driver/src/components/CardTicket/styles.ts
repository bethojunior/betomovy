import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface Props {
  selected?: boolean;
}

export const Container = styled.TouchableOpacity<Props>`
  background: ${({theme, selected}) =>
    selected ? shade(0.01, theme.colors.white) : theme.colors.white};
  height: ${RFValue(160)}px;
  width: ${RFValue(250)}px;
  border-radius: ${RFValue(10)}px;
  flex-direction: row;
  border-width: ${RFValue(1)}px;
  border-color: ${({theme}) => theme.colors.primary};
  border-style: ${({selected}) => (selected ? 'solid' : 'dashed')};
  margin-bottom: ${RFValue(30)}px;
`;

export const Content = styled.View<Props>`
  background: ${({theme, selected}) =>
    selected ? shade(0.5, theme.colors.primary) : theme.colors.primary};
  border-top-left-radius: ${RFValue(10)}px;
  border-bottom-left-radius: ${RFValue(10)}px;
  width: 22%;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.primary};
`;

export const TitleLeft = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.white};
  transform: rotate(-90deg);
  text-align: center;
  width: ${RFValue(150)}px;
  max-height: 75%;
`;

export const SubTitle = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.primary};
  margin-top: ${RFValue(4)}px;
`;

export const Wapper = styled.View`
  width: 75%;
  justify-content: space-between;
  padding-top: ${RFValue(10)}px;
  padding-bottom: ${RFValue(10)}px;
  padding-left: ${RFValue(5)}px;
  padding-right: ${RFValue(5)}px;
`;

export const ContentInfo = styled.View`
  align-items: center;
`;

export const SubValue = styled.Text`
  font-size: ${RFValue(13)}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: ${RFValue(4)}px;
`;

export const Value = styled.Text`
  font-size: ${RFValue(17)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.primary};
`;
