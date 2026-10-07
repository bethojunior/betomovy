import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.black};
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;
