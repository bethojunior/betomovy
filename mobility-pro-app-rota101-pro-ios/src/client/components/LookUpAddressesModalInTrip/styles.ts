import {Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  /* margin-top: ${Platform.OS === 'ios' ? '40' : '0'}px; */
  flex: 1;
`;

export const Content = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ContentInputIcon = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 10px;
  border: 1px solid transparent;
  border-bottom-color: ${({theme}) => theme.colors.border_white_light};
`;

export const ContentInputs = styled.View`
  margin-left: 10px;
  width: 85%;
`;

export const ButtonBack = styled.TouchableOpacity`
  margin: 10px 15px 0;
  max-width: 8%;
`;

export const ContentIcons = styled.View`
  width: 10px;
  align-items: center;
`;

export const OriginIcon = styled.View`
  height: 8px;
  width: 8px;
  margin-top: 20px;
  margin-bottom: 5px;
  border-radius: 50px;
  background-color: ${({theme}) => theme.colors.secondary};
`;

export const DestinationIcon = styled.View`
  height: 8px;
  width: 8px;
  margin-top: 5px;
  margin-bottom: 20px;
  background-color: ${({theme}) => theme.colors.secondary};
`;

export const SeparateIcon = styled.View`
  width: 1px;
  background-color: ${({theme}) => theme.colors.secondary};
  flex: 1;
`;

export const StopIcon = styled.View`
  height: 8px;
  width: 8px;
  border-radius: 50px;
  background-color: ${({theme}) => theme.colors.secondary};
`;

export const WaypointContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const DeleteWaypointButtonContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const DeleteWaypointButton = styled.TouchableOpacity`
  padding: 10px;
`;

export const DestinationAddressContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const WaypointInputAddButtonContainer = styled.View`
  align-items: center;
  margin-left: ${RFValue(5)}px;
  justify-content: center;
`;

export const WaypointInputAddButton = styled.TouchableOpacity`
  border-radius: 50px;
  background-color: ${({theme}) => theme.colors.primary};
  padding: 10px;
`;

export const ButtonConfirm = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  padding: 15px;
  align-items: center;
  justify-content: center;
  margin: 30px 10px;
  border-radius: 10px;
`;

export const ContainerNewValue = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  background-color: ${({theme}) => theme.colors.background_black_light};
`;

export const ContentChangePrice = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  width: 100%;
  min-height: 200px;
  padding: 10px;
`;

export const ContentText = styled.View`
  align-items: center;
  height: 50px;
  flex-direction: column;
  justify-content: space-between;
`;
