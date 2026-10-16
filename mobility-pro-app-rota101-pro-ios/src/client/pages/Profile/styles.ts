import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const SimpleText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium - 1}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const VersionContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium}px;
`;

export const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
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
  image: {
    width: 30,
    height: 30,
  },
});
