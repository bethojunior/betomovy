import {TextInputMask} from 'react-native-masked-text';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ModalBackground = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
  width: 80%;
`;

export const InputMask = styled(TextInputMask)`
  border: 1px solid ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.secondary};
  border-radius: ${({theme}) => theme.borderRadius.small}px;
  padding: 3px;
  text-align: center;
  font-size: 20px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const InfoText = styled.Text`
  font-size: ${RFValue(16)}px;
  margin-top: 10px;
  font-weight: bold;
`;

export const CloseButton = styled.TouchableOpacity`
  margin-top: 10px;
  background-color: #007bff;
  padding: 10px;
  border-radius: 5px;
`;

export const CloseButtonText = styled.Text`
  color: white;
`;

export const CopyButton = styled.TouchableOpacity`
  margin-top: 10px;
  background-color: ${({theme}) => theme.colors.primary};
  padding: 10px;
  border-radius: 5px;
`;

export const CopyButtonText = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
`;
