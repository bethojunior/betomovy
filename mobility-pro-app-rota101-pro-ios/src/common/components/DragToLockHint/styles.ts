import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export const wrapperStyle = StyleSheet.create({
  position: {
    position: 'absolute',
    right: 64,
    bottom: 72,
    zIndex: 2,
  },
}).position;

export const ArrowContainer = styled.View`
  background-color: rgba(0, 0, 0, 0.72);
  border-radius: 18px;
  padding: 8px 12px;
  flex-direction: row;
  align-items: center;
`;

export const ArrowText = styled.Text`
  color: white;
  font-size: 11px;
  margin-left: 5px;
`;
