import {Dimensions} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface PdfProps {
  pdf: boolean;
}

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.white};
`;

export const Content = styled.View`
  padding-left: ${({theme}) => theme.spacing.xxlarge}px;
  padding-right: ${({theme}) => theme.spacing.xxlarge}px;
  margin-top: ${RFValue(15)}px;
`;

export const ContentSendText = styled.View``;

export const Header = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: ${({theme}) => theme.spacing.medium}px;
  padding-right: ${({theme}) => theme.spacing.medium}px;
  height: ${RFValue(45)}px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.primary};
  width: 100%;
  text-align: center;
  text-transform: capitalize;
`;

export const ContentPdfSend = styled.View`
  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
  flex-direction: row;
  align-items: center;
`;

export const PdfWrapper = styled.TouchableOpacity<PdfProps>`
  height: ${RFValue(120)}px;
  width: ${RFValue(100)}px;
  border-radius: ${RFValue(3)}px;
  border-width: ${({pdf}) => (pdf ? RFValue(0.7) : RFValue(1.5))}px;
  border-color: ${({theme, pdf}) =>
    pdf ? theme.colors.black : theme.colors.primary};
  align-items: center;
  justify-content: center;
  margin-top: ${RFValue(5)}px;
`;

export const PdfText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.black};
  margin-top: ${RFValue(10)}px;
`;

export const ContentPhotoSend = styled.View`
  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
  flex-direction: row;
  align-items: center;
`;

export const PhotoWrapper = styled.TouchableOpacity`
  height: ${RFValue(120)}px;
  width: ${RFValue(100)}px;
  border-radius: ${RFValue(3)}px;
  border-width: ${RFValue(1.5)}px;
  border-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  margin-top: ${RFValue(5)}px;
`;

export const PreviewPhoto = styled.Image.attrs({
  resizeMode: 'contain',
})`
  height: ${RFValue(120)}px;
  width: ${RFValue(100)}px;
  border-radius: ${RFValue(3)}px;
  margin-top: ${RFValue(5)}px;
`;

export const ContainerModal = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_black_opacity};
  justify-content: center;
  align-items: center;
`;

export const ContentOptions = styled.View`
  width: ${RFValue(300)}px;
  background: ${({theme}) => theme.colors.white};
  border-radius: ${RFValue(10)}px;
  margin-top: ${RFValue(10)}px;
  justify-content: center;
  padding-left: 10%;
  padding-right: 10%;
  padding-top: ${RFValue(20)}px;
  padding-bottom: ${RFValue(35)}px;
`;

export const ContentOptionsText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
  margin-top: ${RFValue(20)}px;
`;

export const ContentOptionsButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${RFValue(20)}px;
`;

export const Exit = styled.TouchableOpacity`
  position: absolute;
  top: ${RFValue(10)}px;
  right: ${RFValue(10)}px;
`;

export const Attention = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.toast.attention};
`;
