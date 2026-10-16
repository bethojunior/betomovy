import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';
import styled from 'styled-components/native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  image: {
    height: 220,
    margin: 10,
    borderRadius: 10,
  },
  description: {
    margin: 10,
    flex: 1,
  },
  content: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: theme.colors.black,
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
});

export const ContainerWebview = styled.View`
  z-index: 1;
  position: absolute;
`;
