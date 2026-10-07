import {darken, shade} from 'polished';
import {Platform, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import theme from '../../../styles/theme';

interface BottomProps {
  visible?: boolean;
}

interface ButtonTripPreAcceptedProps {
  visible: boolean;
}

export const Container = styled.View`
  flex: 1;
  position: relative;
`;
export const ViewPanic = styled.View`
  align-items: center;
  position: absolute;
  bottom: 0;
  height: 60%;
  width: 100%;
  z-index: 1;
`;

export const ContentButton = styled.View<{
  bottom?: string | number;
}>`
  align-items: center;
  position: absolute;
  bottom: ${({bottom}) => bottom || `${RFValue(140)}px`};
  width: 100%;
`;

export const ButtonTripPreAccepted = styled.TouchableOpacity<ButtonTripPreAcceptedProps>`
  position: absolute;
  top: 150px;
  background-color: ${({theme}) => theme.colors.primary};
  height: 35px;
  elevation: 10;
  width: 45%;
  z-index: 1;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: ${({visible}) => (visible ? 'flex' : 'none')};
`;

export const PreAcceptedContent = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100%;
`;

export const TextPreAccepted = styled.Text`
  font-family: MavenPro_400Regular;
  margin-top: -1px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.background_global};
`;

export const Bottom = styled.View<BottomProps>`
  display: ${({visible}) => (visible ? 'flex' : 'none')};
  height: ${RFValue(130)}px;
  padding-left: ${RFValue(20)}px;
  padding-right: ${RFValue(20)}px;
  width: 100%;
  background-color: ${({theme}) => theme.colors.white};
  border-top-left-radius: ${RFValue(25)}px;
  border-top-right-radius: ${RFValue(25)}px;
  position: absolute;
  bottom: 0;
`;

export const HeaderBottom = styled.View`
  padding-top: ${RFValue(8)}px;
  padding-bottom: ${RFValue(8)}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.black};
`;

export const HeaderBottomTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.black};
  font-family: ${({theme}) => theme.fonts.regular};
  text-align: center;
`;

export const InfoTrip = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${RFValue(8)}px;
  padding-bottom: ${RFValue(8)}px;
  padding-left: ${RFValue(20)}px;
  padding-right: ${RFValue(20)}px;
`;

export const InfoTripTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.black};
  font-family: ${({theme}) => theme.fonts.regular};
`;

export const ButtonBottom = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: ${RFValue(10)}px;
  padding-bottom: ${RFValue(10)}px;
  justify-content: space-between;
`;

export const ButtonBottomText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({theme}) => theme.colors.black};
  font-family: ${({theme}) => theme.fonts.secondary_bold};
`;

export const HeaderTop = styled.View`
  position: absolute;
  top: 0;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${RFValue(20)}px;
  padding-bottom: ${RFValue(8)}px;
  padding-left: ${RFValue(23)}px;
  padding-right: ${RFValue(23)}px;
`;

export const ContainerButtonFloat = styled.View`
  position: absolute;

  flex-direction: column;
  top: ${RFValue(150)}px;
  left: ${RFValue(30)}px;
`;
export const ContainerMultiplier = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.medium}px;
  background-color: ${shade(0.5, `rgba(255, 0, 0, 0.1)`)};
  border-radius: 10px;
`;

export const ContentImage = styled.TouchableOpacity`
  height: ${RFValue(60)}px;
  width: ${RFValue(60)}px;
  border-radius: ${RFValue(50)}px;
`;

export const Avatar = styled.Image.attrs({
  resizeMode: 'stretch',
})`
  background: ${({theme}) => theme.colors.white};
  height: ${RFValue(60)}px;
  width: ${RFValue(60)}px;
  border-radius: ${RFValue(50)}px;
  border-width: 3px;
  border-color: ${({theme}) => theme.colors.white};
`;

export const ContentValue = styled.TouchableOpacity`
  height: ${RFValue(45)}px;
  width: ${RFValue(105)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${RFValue(50)}px;
  background-color: ${({theme}) => theme.colors.black};
  border-width: 3px;
  border-color: ${({theme}) => theme.colors.white};
`;

export const Value = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.fonts.source_semiBold};
`;

export const ContentBell = styled.TouchableOpacity`
  background: ${({theme}) => theme.colors.primary};
  border-radius: ${RFValue(50)}px;
  height: 60%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const ContainerModal = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ModalHeader = styled.TouchableOpacity`
  margin-top: ${Platform.OS === 'ios' ? RFValue(43) : RFValue(15)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-left: ${RFValue(20)}px;
  padding-right: ${RFValue(20)}px;
  padding-bottom: ${RFValue(15)}px;
  justify-content: space-between;
`;

export const ContentModal = styled.View`
  flex: 1;
  background: ${({theme}) => shade(0.15, theme.colors.white)};
`;

export const Returns = styled.View`
  flex-direction: column;
  background: ${({theme}) => theme.colors.primary};
  margin-left: ${RFValue(14)}px;
  margin-right: ${RFValue(14)}px;
  margin-top: ${RFValue(14)}px;
  padding-top: ${RFValue(10)}px;
  padding-bottom: ${RFValue(25)}px;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;

export const ReturnsTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.fonts.regular};
  text-align: center;
`;

export const ReturnsItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: ${RFValue(12)}px;
  padding-right: ${RFValue(12)}px;
  margin-top: ${RFValue(12)}px;
`;

export const BottomModal = styled.View`
  background: ${({theme}) => theme.colors.white};
  padding-top: ${RFValue(10)}px;
  align-items: center;
`;

export const TextOff = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.black};
  font-family: ${({theme}) => theme.fonts.regular};
  text-align: center;
  margin-bottom: ${RFValue(25)}px;
  margin-top: ${RFValue(10)}px;
`;
export const ContainerTextReturn = styled.View`
  padding: 0 ${({theme}) => theme.spacing.large}px;
`;
export const TextReturn = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.fonts.regular};
  margin-top: ${RFValue(10)}px;
`;

export const ContentGraphics = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  margin-left: ${RFValue(15)}px;
  margin-top: ${RFValue(15)}px;
  margin-right: ${RFValue(10)}px;
`;

export const InfoData = styled.View`
  background: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  height: ${RFValue(250)}px;
  width: ${RFValue(320)}px;
`;

export const InfoDataHeader = styled.View`
  margin-left: ${RFValue(10)}px;
  margin-right: ${RFValue(10)}px;
  margin-top: ${RFValue(10)}px;
  border-bottom-width: 0.7px;
  border-bottom-color: ${({theme}) => theme.colors.white};
  align-items: center;
`;

export const InfoDataTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.fonts.regular};
  text-align: center;
`;

export const InfoDataSubTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.fonts.source_semiBold};
`;

export const ViewInfoData = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: ${RFValue(12)}px;
  padding-right: ${RFValue(12)}px;
  padding-top: ${RFValue(8)}px;
`;

export const InfoDataItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const InfoDataItemTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.fonts.regular};
  text-align: center;
`;

export const InfoDataItemNote = styled.View`
  width: 50%;
  align-items: center;
  justify-content: center;
  border-left-width: ${RFValue(1)}px;
  border-left-color: ${({theme}) => theme.colors.white};
`;

export const InfoDataItemNoteTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.fonts.regular};
`;

export const InfoDataItemSubTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.fonts.regular};
  margin-right: ${RFValue(5)}px;
`;

export const InfoDataItemNoteSubTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xslarge}px;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.fonts.regular};
  margin-left: ${RFValue(3)}px;
`;

export const Graphic = styled.View`
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  height: ${RFValue(250)}px;
  width: ${RFValue(320)}px;
  margin-left: ${RFValue(5)}px;
  padding-left: ${RFValue(10)}px;
  padding-right: ${RFValue(10)}px;
  justify-content: center;
  background: ${({theme}) => theme.colors.primary};
`;

export const GraphicTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.fonts.regular};
  text-align: center;
  margin-bottom: ${RFValue(-30)}px;
`;

export const ContainerBottom = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

export const styles = StyleSheet.create({
  circle: {
    borderRadius: 150,
    height: RFValue(90),
    width: RFValue(90),
    borderColor: theme.colors.white,
    borderWidth: 2,
    marginTop: 10,
    zIndex: 1,
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: theme.colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 24,
  },
  bell: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.9,

    elevation: 13,
  },
});
