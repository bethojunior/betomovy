import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ContentProps {
  visible: boolean;
}

export const ContentPlaces = styled.View<ContentProps>`
  display: ${props => (props.visible ? 'flex' : 'none')};
  width: 95%;
  align-self: center;
  /* align-items: center; */
  margin: ${RFValue(20)}px 0;
  border-left-width: 10px;
  padding-left: 5px;
  border-left-color: ${({theme}) => theme.colors.primary};
`;

export const CardPlace = styled.TouchableOpacity`
  width: 95%;
  border-bottom-width: 0.4px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  margin: ${RFValue(5)}px 0;
`;

export const ContentTitle = styled.View`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
`;

export const Title = styled.Text`
  font-weight: bold;
  color: ${({theme}) => theme.colors.primary};
`;

export const SubTitle = styled.Text`
  margin-left: 5px;
  color: ${({theme}) => theme.colors.primary};
`;
