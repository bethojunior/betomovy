import styled from 'styled-components/native';

interface ButtonView {
  color: string;
  selected?: any;
}

export const ButtonOnAndOff = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};

  border-radius: 15px;
  align-items: center;
  justify-content: center;

  height: 60px;
  width: 100%;

  flex-direction: row;

  elevation: 5;

  shadow-color: ${({theme}) => theme.colors.black};
  shadow-opacity: 0.25;
`;
export const ButtonView = styled.TouchableOpacity<ButtonView>`
  background-color: ${({color}) => color};
  border-radius: 15px;
  width: 50%;

  height: 100%;
  align-items: center;
  justify-content: center;

  flex-direction: row;
`;
