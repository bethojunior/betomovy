import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;

export const styles = StyleSheet.create({
  containerOrderTotal: {
    paddingVertical: 10,
    borderBottomColor: themeCss.colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  containerLabelOrderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  labelOrderTotal: {
    fontSize: 16,
  },
});
