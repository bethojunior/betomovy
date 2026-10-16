import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';

import {
  Container,
  Title,
  IconWrapper,
  IconBadge,
  Description,
  Buttons,
  ButtonSignIn,
  ButtonRecused,
  ButtonContent,
  TextButtonSignIn,
  TextButton,
  InfoCard,
  InfoIconBadge,
  InfoTextColumn,
  InfoTitle,
  InfoDescription,
} from './styles';

import theme from '../../styles/theme';
import {translate} from '../../locales';
import {useAuth} from '../../../context/auth';

export function OfferFingerprint() {
  const {setOfferBiometry, saveBiometry} = useAuth();

  const handleFingerprint = async () => {
    const saved = await saveBiometry();

    if (!saved) {
      return;
    }

    setOfferBiometry(false);
  };

  return (
    <Container>
      <Title>{translate('biometry.titleFingerPrint')}</Title>

      <IconWrapper>
        <MaterialCommunityIcons name="fingerprint" size={RFValue(60)} color={theme.colors.primary} />
        <IconBadge>
          <MaterialCommunityIcons name="shield-lock" size={RFValue(22)} color={theme.colors.primaryText} />
        </IconBadge>
      </IconWrapper>

      <Description>
        {translate('biometry.solicitBiometry')} {translate('biometry.solicitBiometryUse')}
      </Description>

      <Buttons>
        <ButtonSignIn activeOpacity={0.7} onPress={handleFingerprint}>
          <ButtonContent>
            <MaterialCommunityIcons name="fingerprint" size={RFValue(20)} color={theme.colors.primaryText} />
            <TextButtonSignIn>{translate('biometry.useAutenticate')}</TextButtonSignIn>
          </ButtonContent>
          <Ionicons name="chevron-forward" size={RFValue(18)} color={theme.colors.primaryText} />
        </ButtonSignIn>

        <ButtonRecused activeOpacity={0.7} onPress={() => setOfferBiometry(false)}>
          <ButtonContent>
            <Ionicons name="lock-closed-outline" size={RFValue(18)} color={theme.colors.secondary} />
            <TextButton>{translate('biometry.notUseAutenticate')}</TextButton>
          </ButtonContent>
          <Ionicons name="chevron-forward" size={RFValue(18)} color={theme.colors.secondary} />
        </ButtonRecused>
      </Buttons>

      <InfoCard>
        <InfoIconBadge>
          <Ionicons name="shield-checkmark-outline" size={RFValue(16)} color={theme.colors.white} />
        </InfoIconBadge>
        <InfoTextColumn>
          <InfoTitle>{translate('biometry.securityTitle')}</InfoTitle>
          <InfoDescription>{translate('biometry.securityDescription')}</InfoDescription>
        </InfoTextColumn>
      </InfoCard>
    </Container>
  );
}
