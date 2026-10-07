import styled from 'styled-components/native';

export const ViewBar = styled.View`
  height: 10px;
  width: 200px;
  border-radius: 25px;
`;

export const Header = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const GoBackButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-left: 20px;
  margin-bottom: 10px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-weight: 600;

  margin-top: 10px;
  text-align: center;

  color: ${({theme}) => theme.colors.secondary};
`;

export const CenterContentContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  padding: 20px 0;
`;

export const IconContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const DotContainer = styled.View`
  flex-direction: row;
`;

export const ButtonCancel = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  height: 38px;
  width: 200px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const TextCancel = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: 18px;
`;