import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ElementsDynamicProps{
    backgroundColor?: string;
    color?: string;
}

export const Container = styled.View`
`;

export const InfoContent = styled.View`
  width: 100%;
  align-self: center;
`;

export const Header = styled.View<ElementsDynamicProps>`
    width: 100%;
    height: 100px;
    background-color: ${props => props.backgroundColor};
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
`;

export const ButtonBack = styled.TouchableOpacity``

export const TitleHeader = styled.Text<ElementsDynamicProps>`
    flex: 1;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.color};
`

export const Content = styled.View`
    align-items: center;
    border-width: 1px;
    border-radius: 5px;
    margin: ${RFValue(5)}px ${RFValue(10)}px;
`

export const TitleContent = styled.Text<ElementsDynamicProps>`
    width: 100%;
    text-align: center;
    padding: 10px;
    background-color: ${props => props.backgroundColor};
    color: ${props => props.color};
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
`

export const ContentForms = styled.View`
    margin: ${RFValue(5)}px ${RFValue(10)}px;
    border-width: 1px;
    border-radius: 5px;
`

export const DriverName = styled.Text`
  font-size: 17px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
`;

export const Photo = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const ButtonEdit = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  margin: 0 10px;
  padding: 20px 0 10px 0;
  border-bottom-color: ${({theme}) => theme.colors.secondary};
  border-bottom-width: 0.4px;
`;

export const ImageContent = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 100px;
`;

export const ContainerModal = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_black_opacity};
  justify-content: center;
  align-items: center;
`;

export const ContentOptions = styled.View`
  width: ${RFValue(300)}px;
  background: ${({theme}) => theme.colors.background_global};
  border-radius: ${RFValue(10)}px;
  margin-top: ${RFValue(10)}px;
  justify-content: center;
  padding-left: 10%;
  padding-right: 10%;
  padding-top: ${RFValue(20)}px;
  padding-bottom: ${RFValue(35)}px;
`;

export const ContentOptionsText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
  margin-top: ${RFValue(20)}px;
`;

export const ContentOptionsButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${RFValue(20)}px;
`;

export const Exit = styled.TouchableOpacity`
  position: absolute;
  top: ${RFValue(10)}px;
  right: ${RFValue(10)}px;
`;

export const TripTypeContent = styled.View`
  border-width: 1px;
  padding-bottom: ${RFValue(2)}px;
  border-radius: 5px;
  margin: ${RFValue(5)}px ${RFValue(10)}px;
`;

export const TitleTripType = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
`;

export const ListTypeContent = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 10px;
`;

export const ItemTripType = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: 14px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Ball = styled.View<ElementsDynamicProps>`
  width: 7px;
  height: 7px;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : ({theme}) => theme.colors.primary};
  border-radius: 50px;
  margin-bottom: 5px;
`;
