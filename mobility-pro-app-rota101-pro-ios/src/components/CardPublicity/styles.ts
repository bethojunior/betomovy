import styled from 'styled-components/native';
import { Card } from '~/components/ui/Card';

export const ITEM_HEIGHT = 108;

export const ContainerCard = styled(Card)`
  width: 100%;
  overflow: hidden;
`;

export const ButtonCard = styled.TouchableOpacity`
  width: 100%;
  height: ${ITEM_HEIGHT}px;
  align-items: center;
`;

export const ImageCard = styled.Image`
  width: 100%;
  height: ${ITEM_HEIGHT}px;
`;
