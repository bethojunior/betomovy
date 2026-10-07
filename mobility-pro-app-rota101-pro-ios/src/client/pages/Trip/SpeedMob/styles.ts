import {MotiView} from 'moti';
import {lighten, shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import themeCss from '../../../styles/theme';


export const Container = styled.SafeAreaView`
  flex: 1;
  shadow-color: ${({theme}) => theme.colors.secondary};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;

  elevation: 5;
`;

export const ContainerDuration = styled.View`
  position: absolute;
  top: 10px;
  align-self: center;
  width: 100px;
  align-items: center;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 10px;
  padding: ${({theme}) => theme.spacing.small}px;

  shadow-color: ${({theme}) => theme.colors.secondary};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;

  elevation: 5;
`;

export const ContainerButtonFloat = styled.View`
  position: absolute;

  flex-direction: column;
  top: ${RFValue(50)}px;
  left: 10px;
`;

export const ContainerCardAddres = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-top: 20px;
`;

export const ContainerCard = styled.View`
  background-color: ${({theme}) => shade(0.05, theme.colors.background_global)};
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  margin: 10px 20px;
  flex: 1;

  elevation: 5;

  shadow-color: ${({theme}) => theme.colors.secondary};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

export const ContainerMinutes = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  width: 50px;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100%;

  elevation: 5;

  shadow-color: ${({theme}) => theme.colors.secondary};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

export const CardContainer = styled.View`
  bottom: 10px;
  align-self: center;
  position: absolute;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  width: 80%;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ContainerButton = styled.TouchableOpacity`
  background-color: transparent;
`;

export const TextCard = styled.Text`
  font-weight: bold;
  width: 70%;
  color: ${({theme}) => theme.colors.secondary};
  margin: 7px;
`;

export const ContentModal = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

export const ContainerModal = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  height: ${RFValue(290)}px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: ${({theme}) => theme.spacing.xlarge}px;
`;
export const ContainerPanic = styled.View`
  flex-direction: row;
`;

export const ButtonPanic = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  width: 50px;
  height: 50px;
  border-radius: 45px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const ContainerAlertPanic = styled(MotiView)`
  border-radius: 25px;
  background-color: ${({theme}) => lighten(0.4, theme.colors.primary)};
  width: 75%;
  margin-left: -15px;
  padding-left: 15px;
  padding-right: 15%;
  margin-right: -15%;
  align-items: center;
  justify-content: center;
`;

export const ViewPanic = styled.View`
  align-items: center;
  position: absolute;
  bottom: 0;
  height: 60%;
  width: 100%;
`;

export const ContentOptionsTrip = styled.View`
  padding: 0 10px;
`

export const ContentAddressMenu = styled.View`
  margin: 10px 0;
  flex-direction: row;
  align-items: center;
`

export const ButtonAddressMenu = styled.TouchableOpacity`
  flex: 1;
`

export const TextAddressMenu = styled.Text`
  font-size: 16px;
  color: ${({theme}) => (theme.colors.primary)};
`

export const ButtonDeleteAddress = styled.TouchableOpacity`
    flex: 0.1;
`

export const TextButtonDeleteAddress = styled.Text``
