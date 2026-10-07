// @ts-nocheck
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import {
  Container,
  Title,
  Description,
  Buttons,
  ButtonRecused,
  TextButton,
  PhotoIcon,
  ButtonSignIn,
  TextButtonSignIn,
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
      <PhotoIcon>
        <MaterialCommunityIcons
          name="fingerprint"
          size={100}
          color={theme.colors.primary}
        />
      </PhotoIcon>

      <Description>
        {translate('biometry.solicitBiometry')}
        {'\n'}
        {translate('biometry.solicitBiometryUse')}
      </Description>

      <Buttons>
        <ButtonSignIn activeOpacity={0.7} onPress={handleFingerprint}>
          <TextButtonSignIn>
            {translate('biometry.useAutenticate')}
          </TextButtonSignIn>
        </ButtonSignIn>
        <ButtonRecused
          activeOpacity={0.7}
          onPress={() => setOfferBiometry(false)}
        >
          <TextButton> {translate('biometry.notUseAutenticate')}</TextButton>
        </ButtonRecused>
      </Buttons>
    </Container>
  );
}
