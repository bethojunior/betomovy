import styled from 'styled-components/native';

export const ButtonSend = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  border-radius: 80px;
  background-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: center;

  elevation: 5;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 5px;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
`;
export const ButtonSendStar = styled.TouchableOpacity`
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;
