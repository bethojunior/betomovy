import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../../../styles/theme';

export const MessageStatus = styled.Text`
  text-align: center;
  margin: 5px 0;
  font-size: 12px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  containerSeparate: {
    width: 15,
    height: 1,
    marginHorizontal: 5,
    backgroundColor: themeCss.colors.border,
  },
  containerItem: {
    width: 40,
    height: 40,
    opacity: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeCss.colors.background_white,
    borderRadius: 100,
  },
});
