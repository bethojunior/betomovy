import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import theme from '../../styles/theme';

interface BottonProps {
  visible?: boolean;
}

export const Container = styled.View`
  position: absolute;
  top: 0;
  width: 100%;
`;

export const HeaderTop = styled.View`
  /* position: absolute;
  top: 0;
  width: 100%; */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${RFValue(10)}px;
  padding-bottom: ${RFValue(8)}px;
  padding-left: ${RFValue(23)}px;
  padding-right: ${RFValue(23)}px;
`;

export const ContentImage = styled.TouchableOpacity`
  height: ${RFValue(60)}px;
  width: ${RFValue(60)}px;
  border-radius: ${RFValue(50)}px;
`;

export const Avatar = styled.Image.attrs({
  resizeMode: 'cover',
})`
  background: ${({theme}) => theme.colors.white};
  height: ${RFValue(60)}px;
  width: ${RFValue(60)}px;
  border-radius: ${RFValue(50)}px;
  border-width: 3px;
  border-color: ${({theme}) => theme.colors.white};
`;

export const ContentValue = styled.TouchableOpacity<BottonProps>`
  height: ${RFValue(45)}px;
  width: ${({visible}) => (visible ? RFValue(60) : RFValue(115))}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${RFValue(50)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-width: 3px;
  border-color: ${({theme}) => theme.colors.primaryText};
`;

export const Value = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({theme}) => theme.colors.primaryText};
  font-family: ${({theme}) => theme.fonts.source_semiBold};
`;

export const ContentBell = styled.TouchableOpacity`
  background: ${({theme}) => theme.colors.primaryText};
  border-radius: ${RFValue(50)}px;
  height: ${RFValue(55)}px;
  width: ${RFValue(55)}px;
  align-items: center;
  justify-content: center;
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
