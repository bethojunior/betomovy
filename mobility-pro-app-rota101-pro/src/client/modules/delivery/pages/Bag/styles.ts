import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../../../styles/theme';

export const Container = styled.View`
  z-index: 10;
  width: 100%;
  padding: 15px;
  background-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`;

export const styles = StyleSheet.create({
  text: {
    color: themeCss.colors.white,
    fontSize: 16,
    position: 'absolute',
    textAlign: 'center',
    left: 0,
    right: 0,
    fontWeight: 'bold',
  },
  price: {
    color: themeCss.colors.white,
    fontSize: 16,
  },
});
