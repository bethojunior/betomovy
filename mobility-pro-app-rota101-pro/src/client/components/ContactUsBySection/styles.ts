import {Dimensions, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

export const Container = styled.View`
  flex-direction: row;
  background-color: ${({theme}) => theme.colors.primary};
  padding: 10px;
  justify-content: space-between;
  align-content: center;
`;

export const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    paddingVertical: 15,
    zIndex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 35,
    height: 35,
  },
  small: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10,
    color: themeCss.colors.white,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
    color: themeCss.colors.white,
  },
  rigthSpace: {
    marginRight: 15,
  },
});
