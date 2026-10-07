import {shade} from 'polished';
import {Dimensions, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../../../styles/theme';

const windowWidth = Dimensions.get('window').width;

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const ContainerItem = styled.View`
  display: flex;
  flex-direction: row;
  border: 1px solid ${themeCss.colors.border};
  padding: 5px;
  margin: 5px 0;
  border-radius: 10px;
  background-color: ${shade(0.05, themeCss.colors.background_global)};
  margin: 0 10px;
`;

export const styles = StyleSheet.create({
  contentItem: {
    flex: 1,
    marginLeft: 10,
  },
  nameItem: {
    // fontSize: 14,
    fontSize: 16,
  },
  detailsItem: {
    fontSize: 14,
    color: themeCss.colors.text_gray,
  },
  estimativeItem: {
    fontSize: 12,
    color: themeCss.colors.text_gray,
  },
  logoItem: {
    width: 100,
    height: 100,
  },
  // containerItem: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   borderColor: themeCss.colors.border,
  //   borderWidth: 1,
  //   padding: 5,
  //   marginVertical: 5,
  //   borderRadius: 10,
  //   backgroundColor: shade(0.05, theme.colors.background_global),
  //   marginHorizontal: 10,
  // },
  banner: {
    width: windowWidth - 20,
    height: 120,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  labelError: {
    textAlign: 'center',
    color: themeCss.colors.secondary,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  textIsClosed: {
    fontWeight: 'bold',
  },
  textRating: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
