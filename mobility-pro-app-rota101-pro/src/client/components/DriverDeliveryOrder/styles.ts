import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

export const LabelNameDriver = styled.Text`
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const DriverName = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;

export const styles = StyleSheet.create({
  container: {
    borderTopColor: themeCss.colors.border,
    borderTopWidth: 1,
    padding: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentInfoDriver: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: 50,
    height: 50,
    backgroundColor: themeCss.colors.black,
    borderRadius: 100,
    marginRight: 10,
  },
});
