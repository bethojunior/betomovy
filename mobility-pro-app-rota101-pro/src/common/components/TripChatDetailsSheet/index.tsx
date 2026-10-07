import { FC } from 'react';
import { BottomSheetModal } from '../../../client/components/BottomSheetModal';
import { TripChatDetailsSheetProps } from './types';
import { Content } from './styles';

// Wrapper fino sobre o BottomSheetModal compartilhado (já cross-importado pelo
// driver em outros lugares) — só o chrome do sheet, o conteúdo (PartnerCard)
// já se auto-explica, sem precisar de um título duplicado aqui.
export const TripChatDetailsSheet: FC<TripChatDetailsSheetProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <BottomSheetModal visible={visible} onRequestClose={onClose}>
      <Content>{children}</Content>
    </BottomSheetModal>
  );
};
