import styled from 'styled-components/native';

interface ButtonView {
  color: string;
  borderColor?: string;
  selected?: any;
}

export const ButtonOnAndOff = styled.View`
  background-color: transparent;

  border-radius: 16px;
  align-items: center;
  justify-content: center;

  height: 60px;
  width: 100%;

  flex-direction: row;

  border-width: 1.5px;
  border-color: ${({theme}) => theme.colors.gray_border ?? '#E2E8F0'};

  elevation: 4;

  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
`;
export const ButtonView = styled.TouchableOpacity<ButtonView>`
  background-color: ${({color}) => color};
  border-radius: 14px;
  width: 50%;

  height: 100%;
  align-items: center;
  justify-content: center;

  flex-direction: row;

  border-width: 1.5px;
  border-color: ${({borderColor}) => borderColor ?? 'transparent'};
`;
