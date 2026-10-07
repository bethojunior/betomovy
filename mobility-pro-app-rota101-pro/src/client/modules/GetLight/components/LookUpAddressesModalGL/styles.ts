import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)``;

export const Content = styled.View`
  background-color: ${({theme}) => shade(0.05, theme.colors.background_global)};
  padding: 0 ${({theme}) => theme.spacing.large}px;
`;

export const ContentInputIcon = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 10px 0;
  border: 1px solid transparent;
`;

export const ContentInputs = styled.View`
  width: 100%;
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
  background-color: ${({theme}) => theme.colors.icon_gray};
`;

export const DestinationIcon = styled.View`
  height: 8px;
  width: 8px;
  margin-top: 5px;
  margin-bottom: 20px;
  background-color: ${({theme}) => theme.colors.icon_gray};
`;

export const SeparateIcon = styled.View`
  width: 1px;
  background-color: ${({theme}) => theme.colors.icon_gray};
  flex: 1;
`;

export const StopIcon = styled.View`
  height: 8px;
  width: 8px;
  border-radius: 50px;
  background-color: ${({theme}) => theme.colors.icon_gray};
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
  justify-content: center;
`;

export const WaypointInputAddButton = styled.TouchableOpacity`
  border-radius: 50px;
  background-color: ${({theme}) => theme.colors.background_global};
  padding: ${({theme}) => theme.spacing.large};
`;

export const ButtonConfirm = styled.TouchableOpacity`
  margin-top: ${({theme}) => theme.spacing.medium}px;
  background-color: ${({theme}) => theme.colors.primary};
  padding: ${({theme}) => theme.spacing.medium}px 0;
  width: 100%;
  border-radius: ${({theme}) => theme.borderRadius.small}px;
  color: ${({theme}) => theme.colors.white};
`;

export const TextConfirmButton = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: ${RFValue(14)}px;
  text-align: center;
`;

export const ContainerBackPage = styled.View`
  position: absolute;
  left: 0px;
`;
