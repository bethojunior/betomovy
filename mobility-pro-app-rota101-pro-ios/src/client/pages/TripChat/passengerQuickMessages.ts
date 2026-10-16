import { translate } from '../../locales';
import type { QuickMessage } from '../../../common/hooks/quickMessages';

// As 3 mensagens rápidas fixas do passageiro (fallback do rodapé do chat).
// Função (não constante de módulo) porque o idioma só resolve de forma assíncrona
// no boot do app; chamar translate() aqui garante o valor já com o locale certo.
export function getPassengerQuickMessages(): QuickMessage[] {
  return [
    { message: translate('trip.chat.quick_reply_on_the_way') },
    { message: translate('trip.chat.quick_reply_will_it_take_long') },
    { message: translate('trip.chat.quick_reply_waiting_for_you') },
  ];
}
