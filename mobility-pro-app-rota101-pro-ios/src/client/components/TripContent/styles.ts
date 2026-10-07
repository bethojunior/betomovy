import {MotiView} from 'moti';
import styled from 'styled-components/native';

export const Container = styled.View`
  height: 304px;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  background-color: ${({theme}) => theme.colors.background_global};
`;
