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
  margin: ${RFValue(5)}px 0;
  border-left-width: 10px;
  padding-left: 5px;
  border-left-color: ${({theme}) => theme.colors.border_green};
`;

export const CardPlace = styled.TouchableOpacity`
  width: 95%;
  border-bottom-width: 0.4px;
  border-bottom-color: ${({theme}) => theme.colors.border_green};
  padding-top: 10px;
  align-items: center;
  flex-direction: row;
  padding-bottom: 10px;
  margin: ${RFValue(5)}px 0;
`;

export const ContentTitle = styled.View`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
`;

export const Title = styled.Text`
  font-weight: bold;
  color: ${({theme}) => theme.colors.border_green};
`;

export const SubTitle = styled.Text`
  margin-left: 5px;
  width: 90%;
  color: ${({theme}) => theme.colors.border_green};
`;
