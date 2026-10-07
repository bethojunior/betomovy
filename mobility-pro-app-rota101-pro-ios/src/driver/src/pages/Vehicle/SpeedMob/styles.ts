import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const Header = styled.View<{ backgroundColor: string }>`
    width: 100%;
    height: 100px;
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.backgroundColor};
    padding: 0 10px;
`

export const TitleHeader = styled.Text<{ colorText: string }>`
    font-size: 20px;
    color: ${props => props.colorText};
    font-weight: bold;
    text-align: center;
    flex: 1;
`

export const ButtonBack = styled.TouchableOpacity``

export const TextDescription = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;

export const Button = styled.TouchableOpacity<{ backgroundColor: string }>`
    padding: 10px 20px;
    border-radius: 8px;
    background-color: ${props => props.backgroundColor};
`

export const TextButton = styled.Text<{ colorText: string }>`
  text-transform: capitalize;
  color: ${props => props.colorText};
  font-size: 18px;
`;

export const ContentVehicle = styled.ScrollView`
  flex: 1;
  margin-top: ${({theme}) => theme.spacing.large}px;
  flex-direction: column;
`;

export const ContainerButton = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  justify-content: space-around;
  flex-direction: row;
`;
