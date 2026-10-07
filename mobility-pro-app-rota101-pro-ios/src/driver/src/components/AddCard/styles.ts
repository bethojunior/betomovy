import styled from 'styled-components/native';

export const Group = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SubGroup = styled.View`
  width: 45%;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.secondary};
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
`;

export const Label = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;
