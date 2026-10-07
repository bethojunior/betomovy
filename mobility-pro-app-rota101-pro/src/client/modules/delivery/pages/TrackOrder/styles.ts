import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../../../styles/theme';

export const Content = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background_global};
  padding-top: 10px;
`;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeCss.colors.background_global,
  },
  containerStatus: {
    borderRadius: 5,
    padding: 10,
    paddingVertical: 15,
    backgroundColor: themeCss.colors.border,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  textStatus: {
    fontSize: 16,
    marginHorizontal: 5,
    fontWeight: '600',
  },
});
