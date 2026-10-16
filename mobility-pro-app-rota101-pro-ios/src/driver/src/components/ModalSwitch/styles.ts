import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';
import {Button} from '../Button';
import {rgba} from 'polished';
import {Card, CardDescription, CardTitle} from '../../../../components/ui/Card';

export const Container = styled.View`
  padding: 10px;
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const InfoContent = styled.View`
  width: 90%;
  align-self: center;
`;

export const Header = styled.View`
  flex-direction: row;
  margin-top: 35px;
`;

export const DriverName = styled.Text`
  font-size: 17px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
`;

export const Photo = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const ButtonEdit = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 0 10px 0;
  border-bottom-color: ${({theme}) => theme.colors.secondary};
  border-bottom-width: 0.4px;
`;

export const ImageContent = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 100px;
`;

export const ContainerModal = styled.View`
  width: 100%;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: absolute;
  background: ${({theme}) => theme.colors.background_black_opacity};
  padding: 0px ${RFValue(20)}px;
`;

export const ContentOptions = styled(Card)`
  align-items: center;
  justify-content: center;
  padding: ${RFValue(32)}px ${RFValue(20)}px ${RFValue(20)}px;
  border-radius: ${RFValue(24)}px;
  background-color: ${({theme}) => theme.colors.background_white};
`;

export const Title = styled(CardTitle)`
  text-align: center;
`;

export const Subtitle = styled(CardDescription)`
  margin-top: ${RFValue(6)}px;
  text-align: center;
`;

export const ContentOptionsButtons = styled.View`
  width: 100%;
  gap: ${RFValue(8)}px;
  margin-top: ${RFValue(32)}px;
  margin-bottom: ${RFValue(16)}px;
`;

export const Exit = styled.TouchableOpacity`
  position: absolute;
  top: ${RFValue(16)}px;
  right: ${RFValue(16)}px;
`;

export const TripTypeContent = styled.View`
  border-bottom-color: ${({theme}) => theme.colors.secondary};
  border-bottom-width: 0.4px;
  margin-top: 30px;
  padding-bottom: 10px;
`;

export const TitleTripType = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
`;

export const ListTypeContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ItemTripType = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: 15px;
  margin-bottom: 5px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Ball = styled.View`
  width: 7px;
  height: 7px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  margin-bottom: 5px;
`;

export const OptionButton = styled.TouchableOpacity<{active?: boolean}>`
  padding: ${RFValue(12)}px 0;
  border-width: 1px;
  align-items: center;
  justify-content: center;
  border-radius: ${RFValue(12)}px;

  ${({active, theme}) =>
    active
      ? css`
          border-color: ${theme.colors.primary};
          background-color: ${rgba(theme.colors.primary, 0.12)};
        `
      : css`
          border-color: ${theme.colors.light_gray};
          background-color: transparent;
        `}
`;

export const OptionText = styled.Text<{active?: boolean}>`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${({theme}) => theme.fontSizes.large}px;

  ${({active, theme}) =>
    active
      ? css`
          font-family: ${theme.fonts.medium};
          color: ${theme.colors.primary};
        `
      : css`
          font-family: ${theme.fonts.regular};
          color: ${theme.colors.light_gray};
        `}
`;

export const SubmitButton = styled(Button)`
  border-radius: ${RFValue(12)}px;
  margin: 0;
`;
