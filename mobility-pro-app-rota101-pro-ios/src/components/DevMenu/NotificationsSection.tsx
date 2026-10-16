import { useEffect, useState } from 'react';
import { Clipboard } from 'react-native';
import * as Notifications from 'expo-notifications';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import {
  SectionWrapper,
  SectionLabel,
  Group,
  Row,
  ActionRow,
  Label,
  ActionLabel,
  Badge,
  BadgeText,
  TokenText,
  colors as menuColors,
} from './styles';
import Push from '~/client/services/push';
import { customToast } from '~/utils/FlashMessage';
import { useAuth } from '~/context/auth';
import apiMain from '~/client/api/apiMain';

type SendState = 'idle' | 'sending' | 'ok' | 'error';

export const NotificationsSection = () => {
  const { user, userDriver, isDriver } = useAuth();
  const { colors } = useTheme();
  const [permission, setPermission] = useState('...');
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sendState, setSendState] = useState<SendState>('idle');

  useEffect(() => {
    const fetch = async () => {
      const perms = await Notifications.getPermissionsAsync();
      setPermission(perms.granted ? 'Concedida' : 'Negada');
      const token = await Push.init();
      setPushToken(token ?? null);
    };
    fetch();
  }, []);

  const handleCopy = () => {
    if (!pushToken) return;
    Clipboard.setString(pushToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAPITest = async () => {
    if (!pushToken || sendState === 'sending') return;
    setSendState('sending');

    const userId = isDriver ? userDriver?.idUser : user?.idUser;

    try {
      const response = await apiMain.post<ApiResponse<any>>('/push/test', {
        userId,
      });

      if (response.data.status && response.data.data?.isSuccess) {
        setSendState('ok');
      } else {
        throw new Error(response.data.message || 'Erro desconhecido');
      }
    } catch (error) {
      setSendState('error');
      customToast(error?.message || error, 'danger');
    } finally {
      setTimeout(() => setSendState('idle'), 4000);
    }
  };

  const sendIcon: Record<SendState, React.ComponentProps<typeof MaterialIcons>['name']> =
    {
      idle: 'send',
      sending: 'hourglass-empty',
      ok: 'check-circle',
      error: 'error-outline',
    };

  const sendColor: Record<SendState, string> = {
    idle: menuColors.blue,
    sending: colors.text_gray,
    ok: colors.serene_green,
    error: colors.red,
  };

  const sendLabel: Record<SendState, string> = {
    idle: 'Testar',
    sending: 'Enviando...',
    ok: 'Enviado!',
    error: 'Erro ao enviar',
  };

  return (
    <SectionWrapper>
      <SectionLabel>Notificações</SectionLabel>
      <Group>
        <Row>
          <Label>Permissão</Label>
          <Badge ok={permission === 'Concedida'}>
            <BadgeText>{permission}</BadgeText>
          </Badge>
        </Row>

        <Row last={!pushToken}>
          <Label style={{ flex: 0, flexShrink: 0 }}>Push Token</Label>
          <TokenText
            numberOfLines={1}
            ellipsizeMode="middle"
            style={{ flex: 2, textAlign: 'right', marginLeft: 12 }}
          >
            {pushToken || (permission === 'Negada' ? 'Sem permissão' : 'Carregando...')}
          </TokenText>
        </Row>

        {pushToken && (
          <>
            <ActionRow onPress={handleCopy}>
              <MaterialIcons
                name={copied ? 'check' : 'content-copy'}
                size={16}
                color={copied ? colors.serene_green : menuColors.blue}
              />
              <ActionLabel style={copied ? { color: colors.serene_green } : undefined}>
                {copied ? 'Token copiado!' : 'Copiar token'}
              </ActionLabel>
            </ActionRow>

            <ActionRow last onPress={handleSendAPITest} disabled={sendState === 'sending'}>
              <MaterialIcons
                name={sendIcon[sendState]}
                size={16}
                color={sendColor[sendState]}
              />
              <ActionLabel style={{ color: sendColor[sendState] }}>
                {sendLabel[sendState]}
              </ActionLabel>
            </ActionRow>
          </>
        )}
      </Group>
    </SectionWrapper>
  );
};
