import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ButtonTargetContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const BodyArrow = styled.View`
  background-color: green;
  padding: ${RFValue(15)}px;
  width: 100%;
`;

export const TextTarget = styled.Text`
  color: white;
  text-align: center;
`;
