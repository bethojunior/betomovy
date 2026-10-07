import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import Colors from '../../components/Colors';
import themeCss from '../../styles/theme';

type ItemLocalProps = {
  active: boolean;
};

export const ContentLocals = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ItemLocals = styled.TouchableOpacity<ItemLocalProps>`
  margin: 15px;
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.white};
  align-items: center;
  border-color: ${({active, theme}) =>
    active ? theme.colors.primary : 'transparent'};
  border-width: ${({active}) => (active ? 2 : 0)};
`;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerItemLocal: {
    margin: 15,
    marginVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
    backgroundColor: themeCss.colors.white,
    alignItems: 'center',
  },
  containerItemLocalActive: {
    margin: 15,
    marginVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
    backgroundColor: themeCss.colors.white,
    alignItems: 'center',
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
  },
  contentDescriptionLocal: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  iconLocal: {
    margin: 10,
  },
  titleLocal: {
    fontSize: 16,
  },
  descriptionLocal: {
    fontSize: 13,
    color: themeCss.colors.text_gray,
  },
  iconOptionLocal: {
    padding: 10,
  },
});
