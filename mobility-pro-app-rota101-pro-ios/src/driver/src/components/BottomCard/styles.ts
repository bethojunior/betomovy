import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import theme from '../../styles/theme';

interface BottomProps {
  visible?: boolean;
}

export const Bottom = styled.View<BottomProps>`
  display: ${({visible}) => (visible ? 'flex' : 'none')};
  height: auto;
  padding-left: ${RFValue(20)}px;
  padding-right: ${RFValue(20)}px;
  width: 100%;
  background-color: ${({theme}) => theme.colors.background_global};
  border-top-left-radius: ${RFValue(25)}px;
  border-top-right-radius: ${RFValue(25)}px;
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
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ButtonBottomText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({theme}) => theme.colors.secondary};
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

export const ContentImage = styled.TouchableOpacity`
  height: ${RFValue(60)}px;
  width: ${RFValue(60)}px;
  border-radius: ${RFValue(50)}px;
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
