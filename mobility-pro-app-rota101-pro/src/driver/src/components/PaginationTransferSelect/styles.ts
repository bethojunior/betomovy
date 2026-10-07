import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ContainerFooter = styled.View`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: ${RFValue(8)}px;
`;