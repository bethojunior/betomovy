import {Dimensions, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import {Button} from '../../components/Button';
import {rgba} from 'polished';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface ButtonLocalizationSpeedMobProps {
  refuse?: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Image = styled.Image`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
  margin: ${RFValue(20)}px;
  padding: 0px;
  border-radius: ${({theme}) => theme.borderRadius.small}px;
`;

export const ImageBackground = styled.ImageBackground`
  flex: 1;
`;

export const Content = styled.View`
  position: absolute;
  padding-left: ${({theme}) => theme.spacing.xxlarge}px;
  padding-right: ${({theme}) => theme.spacing.xxlarge}px;
  padding-top: ${({theme}) => theme.spacing.medium}px;
  padding-bottom: ${({theme}) => theme.spacing.medium}px;
  background-color: ${({theme}) => theme.colors.background_global};
  width: ${windowWidth}px;
  height: ${windowHeight / 4}px;
  bottom: 0px;
`;

export const ViewGuest = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Label = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
  margin-top: ${RFValue(8)}px;
`;

export const ButtonGuest = styled(TouchableOpacity)`
  align-items: center;
  margin-top: ${RFValue(20)}px;
`;

export const TextButtonGuest = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
  margin-right: ${RFValue(8)}px;
`;

export const ContentSpeedMob = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px 20px 0 20px;
`;

export const ContentPage = styled.View``;

export const ContentPageScroll = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(20),
  },
})``;

export const ContentPageFooter = styled.View`
  gap: ${RFValue(16)}px;
  padding: ${RFValue(20)}px;
  border-top-width: 0.5px;
  border-top-color: ${({theme}) => rgba(theme.colors.light_gray, 0.4)};
`;

export const ImageSpeedMob = styled.Image`
  margin-bottom: 10px;
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
`;

export const TextNoticeTermsSpeedMob = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  line-height: ${RFValue(20)}px;
  margin-bottom: 20px;
`;

export const ButtonNextTermsSpeedMob = styled(Button)<{
  isDisabled: boolean;
}>`
  margin: 0;
  opacity: ${props => (props.isDisabled ? 0.5 : 1)};
`;

export const TextButtonTermsSpeedMob = styled.Text`
  font-size: 25px;
  color: ${({theme}) => theme.colors.white};
  text-align: center;
`;

export const ContentLocalizationSpeedMob = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const DescriptionLocalizationSpeedMob = styled.Text`
  font-size: ${RFValue(14)}px;
  line-height: ${RFValue(20)}px;
  text-align: justify;
  margin-bottom: 10px;
`;

export const ContentButtonsLocalizationSpeedMob = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 15px;
  margin-bottom: 25px;
`;

export const ButtonLocalizationSpeedMob = styled(Button)``;

export const TitlePermissionsConcluded = styled.Text`
  font-size: 35px;
  text-align: center;
  background-color: ${({theme}) => theme.colors.wine};
  color: ${({theme}) => theme.colors.sand};
  border-radius: 8px;
  padding: 8px 35px;
  margin-bottom: 10px;
`;

export const TextOkPermissionConcluded = styled.Text`
  font-size: 60px;
  text-align: center;
  color: ${({theme}) => theme.colors.blue_water};
  font-weight: bold;
  position: relative;
  top: -35px;
  transform: rotateZ(-10deg);
`;

export const ContentSelect = styled.View`
  width: 100%;
  border: 1px solid ${({theme}) => theme.colors.black};
  margin: 10px 0;
`;

export const Title = styled.Text`
  font-size: ${RFValue(30)}px;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: ${RFValue(28)}px;
`;

export const TitleLocalizationSpeedMob = styled(Title)`
  margin-top: ${RFValue(16)}px;
  font-size: ${RFValue(27)}px;
  text-align: center;
`;
