import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;

export const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    flex: 1,
  },
  divider: {
    marginHorizontal: 5,
  },
  containerGuest: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGuest: {
    width: 350,
    height: 350,
  },
  labelGuest: {
    marginBottom: 70,
    marginTop: -70,
    color: themeCss.colors.text_gray,
  },
  buttonGuest: {
    borderWidth: 2,
    borderColor: themeCss.colors.icon_gray,
    borderRadius: 5,
    paddingVertical: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonTextGuest: {
    fontWeight: 'bold',
    color: themeCss.colors.text_gray,
    fontSize: 15,
  },
  versionNumber: {
    color: themeCss.colors.secondary,
    fontSize: 12,
    alignSelf: 'center',
    position: 'absolute',
    paddingBottom: 5,
    bottom: 0,
  },
  image: {
    width: 30,
    height: 30,
  },
});
