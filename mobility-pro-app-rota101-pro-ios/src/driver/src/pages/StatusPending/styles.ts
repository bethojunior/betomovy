import {Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  width: 100%;
  background: ${({theme}) => theme.colors.white};
  padding-left: ${RFValue(24)}px;
  padding-right: ${RFValue(24)}px;
`;

export const ArrowBackContainer = styled.View`
  height: ${RFValue(40)}px;
  justify-content: flex-end;
  margin-left: -${RFValue(10)}px;
`;

export const Header = styled.View`
  align-items: center;
  margin-top: 35px;
  margin-bottom: ${RFValue(24)}px;
`;

export const Photo = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const ImageContent = styled.Image.attrs({
  resizeMode: 'stretch',
})`
  width: ${RFValue(120)}px;
  height: ${RFValue(120)}px;
  border-radius: 100px;
`;

interface StatusPhotoProps {
  statusImage: string;
}

export const StatusPhoto = styled.Text<StatusPhotoProps>`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({statusImage, theme}) =>
    statusImage === '1' ? theme.colors.border_green : theme.colors.red};
  font-family: ${({theme}) => theme.fonts.bold};
  margin-top: ${RFValue(15)}px;
`;

export const ContentItem = styled.View`
  border-bottom-width: ${({theme}) => theme.borderWidth.small}px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  margin-top: ${RFValue(5)}px;
`;

export const ContentDoc = styled.View``;

export const DocumentItem = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: ${({theme}) => theme.borderWidth.small}px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  margin-top: ${RFValue(5)}px;
`;

export const ItemLabel = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.secondary_regular};
  color: ${({theme}) => theme.colors.primary};
  margin-top: 10px;

  ${Platform.OS === 'ios' &&
  css`
    margin-bottom: 7px;
  `}
`;

export const InfoItemText = styled.Text`
  width: 100%;
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: 8px;
  margin-top: ${RFValue(7)}px;
  font-family: ${({theme}) => theme.fonts.regular};
  text-decoration: none;
`;

export const ItemAttention = styled.Text`
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.red};
  font-family: ${({theme}) => theme.fonts.secondary_bold};
  text-decoration: none;
  margin-top: ${RFValue(-7)}px;
  margin-bottom: ${RFValue(7)}px;
`;

export const ViewDocument = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
