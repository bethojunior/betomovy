import styled from 'styled-components/native';

export const Container = styled.View`
  display: flex;
  background-color: ${({theme}) => theme.colors.background_global};
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 20px;
`;
export const ContainerAd = styled.View`
  margin-top: 20px;
  display: flex;
  background-color: ${({theme}) => theme.colors.background_global};
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 5px;
`;

export const Text = styled.Text`
  color: white;
  font-size: 20px;
`;
export const ContainerImage = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
`;

export const Image = styled.Image`
  width: 200px;
  height: 200px;
`;
export const ContainerTitle = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 20px;
`;
export const Title = styled.Text`
  text-align: center;
  font-size: 50px;
  color: blue;
`;
export const Subtitle = styled.Text`
  font-size: 20px;
  text-align: center;
  color: ${({theme}) => theme.colors.grayLight};
`;
export const Button = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: 40px;
  font-weight: bold;
  text-align: center;
`;
