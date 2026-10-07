import styled from 'styled-components/native';

interface PropsCard {
  selected?: boolean;
}

export const CardContent = styled.TouchableOpacity<PropsCard>`
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.background_white};
  border-width: 1.5px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.grayBright};
  margin-bottom: 10px;
`;

export const CardPaymentForm = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 7px;
`;

export const TextPaymentType = styled.Text<PropsCard>`
  margin-left: 10px;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.primaryText : theme.colors.secondary};
`;

export const Icon = styled.Image`
  width: 30px;
  height: 30px;
`;
