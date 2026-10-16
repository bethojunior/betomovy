import {Ionicons} from '@expo/vector-icons';
import {Linking, TouchableOpacity, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../client/styles/theme';
import {translate} from '../../client/locales';
import {customToast} from '../../utils/FlashMessage';
import {useGlobalSupportNumber} from '../../context/ConfigGlobal/useGlobalSupportNumber';
import {
  Overlay,
  Card,
  Title,
  Description,
  UpdateButton,
  UpdateButtonText,
  SupportCaption,
  SupportButton,
  SupportButtonRow,
  SupportButtonText,
} from './styles';
import {AppUpdateModalProps} from './types';

export const AppUpdateModal = ({
  visible,
  title,
  description,
  onPressUpdate,
  onClose,
}: AppUpdateModalProps) => {
  const {supportNumber} = useGlobalSupportNumber();

  if (!visible) return null;

  const handlePressSupport = () => {
    Linking.openURL(`https://wa.me/${supportNumber}`).catch(() => {
      customToast(translate('configGlobal.text_error_opening_support'), 'danger');
    });
  };

  return (
    <Overlay>
      <Card>
        {!!onClose && (
          <TouchableOpacity
            style={{ position: 'absolute', top: 12, right: 12, padding: 8, zIndex: 1 }}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={RFValue(22)} color={theme.colors.secondary} />
          </TouchableOpacity>
        )}

        <Ionicons name="warning" size={RFValue(36)} color={theme.colors.red} />

        <Title>{title}</Title>
        <Description>{description}</Description>

        <UpdateButton onPress={onPressUpdate} activeOpacity={0.7}>
          <UpdateButtonText>{translate('configGlobal.update')}</UpdateButtonText>
        </UpdateButton>

        {!!supportNumber && (
          <SupportButton onPress={handlePressSupport} activeOpacity={0.6}>
            <SupportCaption>{translate('configGlobal.text_support_caption')}</SupportCaption>
            <SupportButtonRow>
              <Ionicons name="headset-outline" size={RFValue(18)} color={theme.colors.secondary} />
              <SupportButtonText>{translate('configGlobal.text_support_button')}</SupportButtonText>
            </SupportButtonRow>
          </SupportButton>
        )}

        {!!onClose && (
          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 12, padding: 6 }}
            activeOpacity={0.7}
          >
            <Text style={{ color: theme.colors.text_gray, fontSize: RFValue(13), textAlign: 'center' }}>
              {translate('configGlobal.text_remind_later') || 'Lembrar mais tarde'}
            </Text>
          </TouchableOpacity>
        )}
      </Card>
    </Overlay>
  );
};
