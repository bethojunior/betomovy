import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
interface PropsContent {
  ml?: number;
}

export const ContainerButtonBackPage = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const ContentButtonBackPage = styled.View<PropsContent>`
  padding: ${RFValue(10)}px;
  margin-left: ${({ml}) => (ml ? ml : 10)}px;
`;

export const ContentTitleBackPage = styled.View`
  flex: 1;
  text-align: center;
`;

export const Title = styled.Text`
  text-align: center;
  font-size: ${RFValue(18)}px;
  padding-right: ${RFValue(20)}px;
  color: ${({theme}) => theme.colors.primary};
  font-weight: bold;
`;
