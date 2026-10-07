import {Dimensions, FlatList, FlatListProps} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import {ItemDocumentProps} from '../../components/ItemDocument';

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.white};
`;

export const Header = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: ${({theme}) => theme.spacing.medium}px;
  padding-right: ${({theme}) => theme.spacing.medium}px;
  height: ${RFValue(45)}px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.primary};
  position: absolute;
  width: ${Dimensions.get('window').width}px;
  text-align: center;
`;

export const DocumentList = styled(
  FlatList as new (
    props: FlatListProps<ItemDocumentProps>,
  ) => FlatList<ItemDocumentProps>,
).attrs({
  showsVerticalScrollIndicator: false,
})`
  width: 100%;
  padding-left: ${RFValue(24)}px;
  padding-right: ${RFValue(24)}px;
  margin-top: ${RFValue(30)}px;
`;
