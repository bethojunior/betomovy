import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import {Card, CardDescription, CardTitle} from '../../components/ui/Card';

interface IDescriptionModalProps {
  colorText?: string;
  fontBold?: boolean;
}

export const Container = styled.View`
  width: 100%;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: #00000070;
  padding: 0px ${RFValue(10)}px;
`;

export const ContentModal = styled(Card)`
  align-items: center;
  justify-content: center;
  gap: ${RFValue(6)}px;
  padding: ${RFValue(20)}px;
  border-radius: ${RFValue(24)}px;
  background-color: ${({theme}) => theme.colors.background_white};
`;

export const IconMocal = styled.Image`
  width: ${RFValue(120)}px;
  height: ${RFValue(120)}px;
`;

export const TitleModal = styled(CardTitle)`
  width: 100%;
  color: ${({theme}) => theme.colors.red};
  border-bottom-width: 1px;
  text-align: center;
  border-color: ${({theme}) => theme.colors.black};
  padding-bottom: 10px;
`;

export const DescriptionModal = styled(CardDescription)<IDescriptionModalProps>`
  color: ${({colorText, theme}) => colorText ?? theme.colors.text_gray};
  font-weight: ${({fontBold}) => (fontBold ? 'bold' : 'normal')};
  text-align: justify;
`;

export const ContentButton = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 5px 0;
`;

export const LabelButton = styled.Text`
  font-size: 16px;
`;
