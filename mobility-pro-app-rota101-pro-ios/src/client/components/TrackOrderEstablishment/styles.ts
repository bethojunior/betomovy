import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

export const DescriptionEstablishment = styled.Text`
  font-size: 18px;
  margin: 20px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const styles = StyleSheet.create({
  containerEstablishment: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  logoEstablishment: {
    width: 35,
    height: 35,
    backgroundColor: themeCss.colors.grayLight,
    borderRadius: 100,
  },
});
