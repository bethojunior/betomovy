import {shade} from 'polished';
import {Dimensions} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const List = styled.FlatList`
  flex: 1;
  margin-bottom: 5px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin: 10px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContainerItem = styled.Pressable`
  flex: 1;
  max-width: ${Dimensions.get('screen').width / 3}px;
`;

export const ContentItem = styled.View`
  margin: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: ${({theme}) => shade(0.05, theme.colors.background_global)};
  border-radius: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const IconItem = styled.Image`
  margin: 10px 0;
  width: 41px;
  height: 41px;
`;
export const TextItem = styled.Text`
  font-size: ${RFValue(12)}px;
  color: ${({theme}) => theme.colors.secondary};
`;
