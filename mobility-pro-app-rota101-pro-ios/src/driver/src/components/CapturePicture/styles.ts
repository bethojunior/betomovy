import {CameraType} from 'expo-camera';
import {TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface CamProps {
  type?: CameraType;
}

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

export const ButtonCapture = styled(TouchableOpacity)`
  background: ${({theme}) => theme.colors.primaryText};
  justify-content: center;
  align-items: center;
  height: ${RFValue(60)}px;
  width: ${RFValue(60)}px;
  border-radius: 50px;
  margin-bottom: ${RFValue(20)}px;
`;

export const ButtonAlter = styled(TouchableOpacity)`
  position: absolute;
  top: ${RFValue(40)}px;
  right: ${RFValue(30)}px;
`;

export const ContainerPreview = styled.SafeAreaView`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const Preview = styled.ImageBackground<CamProps>`
  flex: 1;
  justify-content: flex-end;
  align-self: stretch;
  transform: ${props => (props.type === 'front' ? 'scaleX(-1)' : 'scaleX(1)')};
`;

export const ContainerButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${RFValue(100)}px;
  padding-left: ${RFValue(50)}px;
  padding-right: ${RFValue(50)}px;
  margin-bottom: ${RFValue(30)}px;
`;

export const ButtonAccept = styled(TouchableOpacity)`
  background: ${({theme}) => theme.toast.success};
  justify-content: center;
  align-items: center;
  height: ${RFValue(60)}px;
  width: ${RFValue(60)}px;
  border-radius: 50px;
`;

export const ButtonRecused = styled(TouchableOpacity)`
  background: ${({theme}) => theme.toast.attention};
  justify-content: center;
  align-items: center;
  height: ${RFValue(60)}px;
  width: ${RFValue(60)}px;
  border-radius: 50px;
`;
