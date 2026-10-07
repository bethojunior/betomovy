import {shade} from 'polished';
import styled from 'styled-components/native';

export const ContainerCard = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  background: ${({theme}) => shade(0.1, theme.colors.primary)};
  border-radius: 10px;
  margin-bottom: ${({theme}) => theme.spacing.xlarge}px;
  padding: ${({theme}) => theme.spacing.medium}px;
  align-items: center;
`;

export const ContainerWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
