import styled from 'styled-components/native';

interface Props {
  backgroundColor?: string;
}

export const ButtonFloatContainer = styled.TouchableOpacity<Props>`
  width: 50px;
  height: 50px;
  border-radius: 100px;

  margin-bottom: 10px;

  align-items: center;
  justify-content: center;
  background-color: ${({theme, backgroundColor}) =>
    backgroundColor ? backgroundColor : theme.colors.primary};

  z-index: 1;

  elevation: 5;

  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;
