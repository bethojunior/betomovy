import { CardBoard } from '../CardBoard';
import { ContainerBaseBoard } from './styles';
import type { QuickMessage } from '../../hooks/quickMessages';

interface Props {
  messages: QuickMessage[];
  onSelect: (message: string) => void;
}

// Linha de chips de mensagem rápida (favoritas + fixas) no rodapé do chat —
// compartilhada entre motorista e passageiro.
export function QuickMessagesRow({ messages, onSelect }: Props) {
  return (
    <ContainerBaseBoard>
      {messages.map((item, index) => (
        <CardBoard key={index} onPress={() => onSelect(item?.message)} text={item?.message} />
      ))}
    </ContainerBaseBoard>
  );
}
