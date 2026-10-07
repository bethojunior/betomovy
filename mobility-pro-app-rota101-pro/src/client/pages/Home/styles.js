import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
`;

export const Navbar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme}) => theme.colors.background_blue_light};
  padding: 5px 10px;
`;

export const Header = styled.View`
  background-color: ${({theme}) => theme.colors.background_blue_light};
  padding: 5px 10px 20px;
`;

export const HeaderTitle = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 15px;
`;

export const HeaderDescription = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: 16px;
`;

export const HeaderButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.black};
  border-radius: 30px;
  padding: 5px 15px;
  max-width: 40%;
  margin: 15px 0 0;
`;

export const HeaderButtonText = styled.Text`
  color: ${({theme}) => theme.colors.white};
  text-align: center;
  font-size: 16px;
`;

export const ServiceTypeList = styled.View`
  flex-direction: row;
  margin: 15px 20px;
  justify-content: space-between;
`;

export const ServiceTypeItem = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.background_white_light};
  padding: 10px;
  elevation: 3;
  flex: 1;
  max-width: 30%;
  border-radius: 5px;
`;

export const ServiceTypeItemContent = styled.View`
  align-items: center;
  justify-content: center;
`;

export const ServiceTypeItemImage = styled.ImageBackground`
  width: 100%;
  height: 50px;
  margin-bottom: 5px;
`;

export const ServiceTypeItemText = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

export const WhereForInput = styled.TouchableOpacity`
  padding: 10px 15px;
  elevation: 3;
  border-radius: 25px;
  background-color: ${({theme}) => theme.colors.background_white};
  margin: 5px 20px 10px;
  flex-direction: row;
  align-items: center;
`;

export const WhereForText = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colors.grayLight};
  margin-left: 10px;
`;

export const MapContainer = styled.View`
  margin: 10px 20px;
`;

export const LastPlaces = styled.View`
  margin: 10px 20px 5px;
`;

export const LastPlaceItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid transparent;
  border-bottom-color: ${({theme}) => theme.colors.grayLight};
  padding: 10px 0;
`;

export const LastPlaceItemContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const LastPlaceItemIcon = styled.View`
  background-color: ${({theme}) => theme.colors.background_white};
  width: 40px;
  height: 40px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const LastPlaceItemText = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;
