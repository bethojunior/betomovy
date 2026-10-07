import {Ionicons} from '@expo/vector-icons';
import {Linking} from 'react-native';
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

export const AppUpdateModal = ({visible, title, description, onPressUpdate}: AppUpdateModalProps) => {
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
      </Card>
    </Overlay>
  );
};
