import { translate } from '../../../../client/locales';
import type { QuickMessage } from '../../../../common/hooks/quickMessages';

// As 3 mensagens rápidas fixas do motorista (fallback do rodapé do chat).
// Função (não constante de módulo) porque o idioma só resolve de forma assíncrona
// no boot do app; chamar translate() aqui garante o valor já com o locale certo.
export function getDriverQuickMessages(): QuickMessage[] {
  return [
    { message: translate('trip.chat.quick_reply_arriving') },
    { message: translate('trip.chat.quick_reply_where_are_you') },
    { message: translate('trip.chat.quick_reply_reference') },
  ];
}
