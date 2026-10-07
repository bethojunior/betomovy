import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)``;

export const Content = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ButtonText = styled.TouchableOpacity`
  width: 100%;
  margin-left: ${RFValue(20)}px;
  flex-direction: row;
  align-items: center;
`;

export const ContainerButtonsUse = styled.View`
  flex-direction: column;
  width: 100%;
  border-top-width: 0.4px;
  border-top-color: ${({theme}) => theme.colors.secondary};
  background-color: ${({theme}) => shade(0.05, theme.colors.background_global)};
`;

export const ContentInputIcon = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 10px;
  border: 1px solid transparent;
  border-bottom-color: ${({theme}) => theme.colors.background_global};
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
  background-color: ${({theme}) => theme.colors.background_white};
  padding: 10px;
`;
