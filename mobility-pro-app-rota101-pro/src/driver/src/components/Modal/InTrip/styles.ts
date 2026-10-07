import {MotiView} from 'moti';
import {Swipeable} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

interface AddressProps {
  selected: boolean;
}

interface ContentProgressProps {
  visible: boolean;
}

interface ProgressBarrerProps {
  width: number;
}

export const Modal = styled(MotiView)`
  background-color: ${({theme}) => theme.colors.background_global};
  width: 95%;
  padding: 5px;
  align-self: center;
  position: absolute;
  bottom: 20px;
  border-radius: 8px;

  border: 0.5px solid ${({theme}) => theme.colors.border};
  z-index: 1;
`;

export const SimpleText = styled.Text`
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(12)}px;
`;

export const MoreInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 10px 0 10px;
`;

export const SimpleTitle = styled.Text`
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ClientContent = styled.TouchableOpacity`
  position: absolute;
  top: -30px;
  left: 15px;
`;

export const Picture = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 50px;
`;

export const ClientName = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
  align-self: center;
  margin-top: 3px;
`;

export const ButtonContent = styled.View`
  align-self: flex-end;
  flex-direction: row;
  margin-top: 5px;
  margin-right: 15px;
  width: 25%;
  justify-content: space-between;
`;

export const Button = styled.TouchableOpacity`
  padding: 5px;
  width: 40px;
  height: 40px;

  position: relative;
`;

export const Dot = styled(MotiView)`
  width: 10px;
  height: 10px;
  position: absolute;
  right: 0;
  border-radius: 100px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const AddressContent = styled.View`
  flex-direction: row;
  margin-top: 5px;
  padding: 0 10px;
`;

export const Ball = styled.View`
  width: 13px;
  height: 13px;
  border-radius: 100px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const Line = styled.View`
  height: auto;
  border-left-width: 0.5px;
  border-color: ${({theme}) => theme.colors.primary};
  flex: 1;
`;

export const Square = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${({theme}) => theme.colors.primary};
  margin-bottom: 5px;
`;

export const Origin = styled.Text`
  font-size: 17px;

  margin-left: 10px;
  font-family: MavenPro_500Medium;
`;

export const Destination = styled.Text`
  font-size: 15px;
  margin-top: 10px;

  margin-left: 10px;
  font-family: MavenPro_400Regular;
`;

export const Address = styled.Text<AddressProps>`
  font-family: ${({selected}) =>
    selected ? 'MavenPro_500Medium' : 'MavenPro_400Regular'};
  margin-left: 10px;
  font-size: ${({selected}) => (selected ? '17px' : '15px')};
  color: ${({theme}) => theme.colors.secondary};
  margin-top: 10px;
`;

export const ButtonMinimizeModal = styled.Pressable`
  align-self: center;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  margin-top: -20px;

  elevation: 5;
`;

export const StatusButton = styled.View`
  margin: 15px 0 5px 0;
  width: 95%;
  align-self: center;
  height: 45px;
  elevation: 3;
  justify-content: center;
  border-radius: 15px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ButtonStatus = styled.TouchableOpacity`
  margin: 25px 0 5px 0;
  width: 95%;
  align-self: center;
  height: 45px;
  elevation: 3;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const Arrastable = styled(Swipeable)`
  border-radius: 15px;
`;

export const StatusContent = styled.View`
  width: 100%;
  border-radius: 20px;
  align-items: center;
  justify-items: center;
  align-self: center;
  height: 100%;
  border-radius: 15px;
  flex-direction: row;
  transition: 2s all;
`;
export const Test = styled.View`
  border-radius: 15px;
  flex: 1;
  background-color: ${({theme}) => theme.colors.primary};
  justify-content: center;
  width: 270px;
`;

export const Dragable = styled.View`
  width: 100%;
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.primary};
  padding-left: 15px;
  transition: 1.5s all;
  height: 45px;
  justify-content: center;
`;

export const TextDraggable = styled.Text`
  font-size: 17px;
  color: ${({theme}) => theme.colors.background_global};
  font-family: MavenPro_500Medium;
`;

export const ContentProgressTime = styled.View<ContentProgressProps>`
  display: ${({visible}) => (visible ? 'flex' : 'none')};
  background-color: ${({theme}) => theme.colors.secondary};
  width: 90%;
  align-self: center;
  align-items: center;
  border-radius: 30px;
  height: 40px;
  position: absolute;
  top: 130px;
  z-index: 2;
  justify-content: center;
  overflow: hidden;
  elevation: 5;
`;

export const ProgressBarrer = styled.View<ProgressBarrerProps>`
  transition: 0.5s all;
  height: 50px;
  width: ${({width}) => (width >= 100 ? '100%' : `${width}%`)};
  align-self: flex-start;
  height: 40px;
  border-radius: 30px;
  background-color: ${({theme}) => theme.colors.primary};
  position: absolute;
`;

export const TextTime = styled.Text`
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.background_global};
  align-self: center;
  font-size: ${RFValue(10)}px;
`;

export const Time = styled.Text`
  margin-left: 10px;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.background_global};
  font-size: ${RFValue(14)}px;
`;

export const CotentTime = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const SwalButtonContainers = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

interface SwalButtonProps {
  backgroundColor: string;
}

export const SwalButton = styled.TouchableOpacity<SwalButtonProps>`
  padding: 8px;
  background-color: ${({backgroundColor}) => backgroundColor};
  border-radius: 5px;
  margin-top: 10px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.5px;
`;
