import {shade} from 'polished';
import styled, {css} from 'styled-components/native';
import themeCss from '../../styles/theme';
import {RFValue} from 'react-native-responsive-fontsize';

interface PropsSubtitle {
  recalculed?: boolean;
}
interface PropsButtonText {
  pressed?: boolean;
}
export const Container = styled.SafeAreaView`
  align-items: center;
  padding-bottom: ${RFValue(20)}px;
`;

export const Header = styled.View`
  flex-direction: row-reverse;
  width: 100%;
`;

export const ButtonBack = styled.TouchableOpacity`
  margin: ${RFValue(10)}px ${RFValue(15)}px 0;
  max-width: 8%;
`;

export const ContainerPrice = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;

  margin-top: ${RFValue(20)}px;

  padding: 0px ${({theme}) => theme.spacing.large}px;
`;

export const RoutesImage = styled.Image`
  width: ${RFValue(90)}px;
  height: ${RFValue(90)}px;
  margin: ${RFValue(10)}px 0;
`;

export const Content = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: ${RFValue(20)}px;
  padding: 0 ${RFValue(30)}px;
`;

export const ScrollAddress = styled.ScrollView`
  width: 100%;
  max-height: ${RFValue(180)}px;
`;
export const Title = styled.Text`
  margin: ${RFValue(5)}px 0;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.white};
  font-family: MavenPro_600SemiBold;
`;

export const TitleSmall = styled.Text`
  margin: ${RFValue(5)}px 0;
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.white};
  font-family: MavenPro_400Regular;
`;

export const ContainerRow = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

export const SubTitle = styled.Text<PropsSubtitle>`
  width: 90%;
  text-align: center;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.white};
  ${({recalculed, theme}) =>
    recalculed &&
    css`
      color: ${theme.colors.orange};
      margin-top: ${RFValue(10)}px;
    `}
`;

export const TripValue = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xslarge}px;
  font-family: MavenPro_600SemiBold;
  color: ${({theme}) => theme.colors.white};
`;

export const DriverInfoContainer = styled.View`
  align-items: center;
  margin-bottom: ${RFValue(10)}px;
`;

export const DriverProfilePicture = styled.Image`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
  border-radius: ${RFValue(50)}px;
`;

export const DriverRatingContainer = styled.View`
  flex-direction: row;
  bottom: 0;
  position: absolute;
  background-color: ${({theme}) => theme.colors.white};
  align-items: center;
  justify-content: center;
  width: ${RFValue(68)}px;
  elevation: 1;
  border-radius: ${RFValue(10)}px;
`;

export const DriverRating = styled.Text`
  margin-right: ${RFValue(4)}px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
`;

export const CommentBox = styled.TextInput`
  border: ${RFValue(2)}px solid;
  height: ${RFValue(40)}px;
  border-color: ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.secondary};
  margin: ${RFValue(8)}px 0;
  width: 60%;
  border-radius: ${RFValue(4)}px;
  padding: ${RFValue(2)}px ${RFValue(6)}px;
`;

export const SendEvaluationButton = styled.Pressable`
  align-items: center;
  justify-content: center;
  margin-top: ${RFValue(8)}px;
  width: 100%;
  padding: ${RFValue(10)}px 0;
  border-radius: ${RFValue(10)}px;
`;

export const ContainerButton = styled.View`
  border-bottom-color: ${({theme}) => theme.colors.grayLight};
  border-bottom-width: ${RFValue(0.5)}px;
  align-items: center;
  width: 100%;
  justify-content: center;
  padding: 0 0 ${RFValue(5)}px 0;
`;

export const SendEvaluationButtonText = styled.Text<PropsButtonText>`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_400Regular;
`;

export const ContainerText = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: ${RFValue(10)}px;
`;

export const Address = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.fontSizes.medium}px;

  font-family: MavenPro_400Regular;
  margin-bottom: ${RFValue(10)}px;
`;

export const AddressContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 ${RFValue(10)}px 0 0;
`;

export const Ball = styled.View<any>`
  background-color: ${({theme, color}) =>
    color === 'primary' ? theme.colors.primary : theme.colors.secondary};
  border-radius: ${RFValue(100)}px;
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  align-self: center;
`;

export const Destiny = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.fontSizes.medium}px;

  font-family: MavenPro_400Regular;
`;

export const Square = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  align-self: center;
`;

export const Line = styled.View`
  border-width: ${RFValue(0.8)}px;
  border-color: ${({theme}) => theme.colors.primary};
  flex: 1;
  width: ${RFValue(1)}px;
  align-self: center;
  border-style: dashed;
  min-height: ${RFValue(20)}px;
`;
