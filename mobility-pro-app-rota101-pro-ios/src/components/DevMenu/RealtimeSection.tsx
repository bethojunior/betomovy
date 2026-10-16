import { useEffect, useState } from 'react';
import {
  SectionWrapper,
  SectionLabel,
  Group,
  Row,
  Label,
  ValueText,
  Badge,
  BadgeText,
} from './styles';
import { isRealtimeSocketEnabled } from '~/utils/realtime/realtimeSocketFlag';

type RealtimeType = 'Socket' | 'Firebase';

export const RealtimeSection = () => {
  const [realtimeType, setRealtimeType] = useState<RealtimeType>('Firebase');

  useEffect(() => {
    setRealtimeType(isRealtimeSocketEnabled() ? 'Socket' : 'Firebase');
  }, []);

  return (
    <SectionWrapper>
      <SectionLabel>Conexão Realtime</SectionLabel>
      <Group>
        <Row>
          <Label>Protocolo ativo</Label>
          <Badge ok={realtimeType === 'Socket'}>
            <BadgeText>{realtimeType}</BadgeText>
          </Badge>
        </Row>

        <Row last>
          <Label>Tipo de conexão</Label>
          <ValueText>
            {realtimeType === 'Socket' ? 'Socket.io' : 'Firebase Firestore'}
          </ValueText>
        </Row>
      </Group>
    </SectionWrapper>
  );
};
