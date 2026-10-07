import styled from 'styled-components/native';
import IconArrow from '@expo/vector-icons/FontAwesome5';

interface TitleProps {
  color: string;
}

interface SubTitleProps {
  color: string;
}

export const Title = styled.Text<TitleProps>`
  color: ${(props) => props.color ? props.color : ({ theme }) => theme.colors.secondary};
  font-size: 16px;
`;

export const SubTitle = styled.Text<SubTitleProps>`
  color: ${(props) => props.color ? props.color : ({ theme }) => theme.colors.secondary};
`;

export const Icon = styled.Text`
  position: absolute;
  right: 15px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const SimpleText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
`;

export const TextLocal = styled.Text`
  font-size: 16px;
  max-width: 90%;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const IconLocal = styled(IconArrow)`
  margin-left: 5px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const ContainerSearchInput = styled.View`
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.background_global};
`;
