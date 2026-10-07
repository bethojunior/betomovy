import {shade} from 'polished';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../../../styles/theme';

export const ResumeEstablishment = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const OptionButtonText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: 12px;
`;

export const ContainerItem = styled.View`
  background-color: ${({theme}) => shade(0.2, theme.colors.background_global)};
  border-radius: 5px;
  padding: 10px 0;
  margin: 10px;
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: 16px;
`;

export const styles = StyleSheet.create({
  infoEstablishment: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: themeCss.colors.border,
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  logoEstablishment: {
    margin: 5,
    marginHorizontal: 20,
    elevation: 1,
  },
  nameEstablisment: {
    fontSize: 16,
  },
  contentItems: {
    paddingVertical: 5,
  },
  contentItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  requestOptions: {
    display: 'flex',
    flexDirection: 'row',
    borderTopColor: themeCss.colors.border,
    borderTopWidth: 1,
  },
  contentOptionButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
});
