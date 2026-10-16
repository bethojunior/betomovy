import styled from 'styled-components/native';

export const Wrapper = styled.View`
  bottom: 10px;
  align-self: center;
  position: absolute;
  width: 80%;
  flex-direction: column;
`;

export const ErrorCard = styled.View`
  width: 100%;
  margin-bottom: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  background-color: ${({theme}) => theme.colors.redLight};
  border-width: 1px;
  border-style: solid;
  border-color: ${({theme}) => theme.colors.red};
`;

export const ErrorText = styled.Text`
  font-size: 14px;
  margin-left: 6px;
  flex-shrink: 1;
  color: ${({theme}) => theme.colors.red};
`;

export const CardContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  width: 100%;
  background-color: ${({theme}) => theme.colors.primary};
`;
