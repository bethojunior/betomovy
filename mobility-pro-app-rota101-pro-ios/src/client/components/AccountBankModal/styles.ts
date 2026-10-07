import styled from 'styled-components/native';

interface TitleProps {
  modeEdit: boolean;
}

export const Title = styled.Text<TitleProps>`
  font-size: 12px;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: ${({modeEdit}) => (modeEdit ? 0 : '-10px')};
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: -5px;
  margin-bottom: 10px;
  justify-content: space-between;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ButtonMode = styled.TouchableOpacity`
  padding: 6px;
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const TextButtonMode = styled.Text`
  font-size: 11px;
  color: ${({theme}) => theme.colors.white};
`;

export const Section = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
