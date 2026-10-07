import styled from 'styled-components/native';

export const Content = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
`;

export const ContentEmpty = styled.View`
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const Header = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Section = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Icon = styled.Image`
  width: 50px;
  height: 50px;
  margin-top: 10px;
  align-self: center;
`;

export const ButtonIndication = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.primary};
  margin-top: 40px;
  align-self: center;
`;

export const ContentCard = styled.View`
  align-items: center;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: auto;
`;

export const TitleButton = styled.Text`
  color: ${({ theme }) => theme.colors.primaryText};
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;

export const Title = styled.Text`
  margin-top: 15px;
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Card = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  border-width: 0.9px;
  border-color: black;
  width: 49%;
  margin-bottom: 10px;
  min-height: 200px;
  max-height: 200px;
  height: 200px;
`;

export const ContentInfo = styled.View`
  padding: 15px;
  align-items: center;
  margin-top: 10px;
  text-align: center;
`;

export const ImageCard = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: ${({theme}) => theme.borderRadius.xxxlarge}px;
  margin-right: 10px;
  margin-bottom: 10px;
  position: absolute;
  align-self: center;
  margin-top: 10px;
`;

export const TypeIndication = styled.Text`
  font-size: 14px;
  color: black;
  margin-top: 5px;
  color: ${({theme}) => theme.colors.primary};
`;

export const Name = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  color: black;
  text-transform: capitalize;
`;

export const CityContent = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;

export const ButtonShowMore = styled.TouchableOpacity`
  align-self: center;
  justify-content: flex-end;
  margin-top: 20px;
  background-color: ${({theme}) => theme.colors.primary};
  padding: 10px;
  border-radius: 5px;
`;
