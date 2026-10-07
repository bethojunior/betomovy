import {MotiView} from 'moti';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ButtonReasonProps {
  selected: boolean;
}

export const ButtonReason = styled.TouchableOpacity<ButtonReasonProps>`
  border-bottom-color: black;
  border-bottom-width: ${({selected}) => (selected ? 0 : '0.5px')};
  background-color: ${({theme, selected}) =>
    selected ? theme.colors.primary : theme.colors.background_global};
  border-radius: 5px;
  padding: 5px;
  margin-top: 5px;
`;

export const ButtonContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 10px;
`;

export const ReasonName = styled.Text<ButtonReasonProps>`
  font-size: 16px;
  color: ${({theme, selected}) =>
    selected ? theme.colors.primaryText : theme.colors.secondary};
  font-family: MavenPro_400Regular;
`;

export const Content = styled.ScrollView`
  max-height: 400px;
  margin-bottom: 10px;

  padding: 0 20px;
`;

export const ContentDescription = styled.View`
  padding: 0 15px;
`;

export const ContainerButton = styled.View`
  margin: 15px 0;
  padding: 0 20px;
  height: 50px;
`;

export const ButtonConfirm = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 5px;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

export const Description = styled.Text`
  font-size: ${RFValue(12)}px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: bold;
  font-family: MavenPro_400Regular;
  text-align: justify;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 10px;

  margin-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const ViewRelative = styled(MotiView)`
  flex: 1;
  position: absolute;
  bottom: 0;
  width: 100%;
  min-height: ${RFValue(305)}px;
  z-index: 1;
`;

export const ContainerAll = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  shadow-color: ${({theme}) => theme.colors.primary};
  elevation: 8;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  height: 100%;
`;
