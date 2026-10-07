import styled from 'styled-components/native';

interface InputProps {
  textAlign?: 'left' | 'right' | 'center' | 'auto';
  editable?: boolean;
}

export const Input = styled.TextInput<InputProps>`
  border-width: ${({editable}) => (editable ? '1px' : 0)};
  border-color: ${({theme}) => theme.colors.secondary};
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
  color: ${({theme}) => theme.colors.secondary};
  text-align: ${({textAlign}) => textAlign || 'left'};
`;
