// @ts-nocheck

import {useFocusEffect} from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
import {If} from '../If';
import {RFValue} from 'react-native-responsive-fontsize';

interface Props {
  setEnabled?: (enabled: boolean) => void;
  setEnabledBiometry?: (enabled: boolean) => void;
  onPress?: () => void;
}

export function Fingerprint({setEnabled, onPress, setEnabledBiometry}: Props) {
  const {
    signOut,
    setRequestFingerprint,
    authenticateBiometry,
    setOfferBiometry,
  } = useAuth();

  useFocusEffect(() => {
    handleFingerprint();
  });

  const handleFingerprint = async () => {
    const result = await authenticateBiometry();
    if (result) {
      onPress && (await onPress());
      setEnabled && setEnabled(false);
      setRequestFingerprint(false);
      return;
    }
    // await AsyncStorage.removeItem('biometry_enabled');
    await AsyncStorage.removeItem('biometry_switch');
    setEnabled && setEnabled(false);
    setEnabledBiometry && setEnabledBiometry(false);
    setOfferBiometry(false);
  };

  return (
    <If condition={!setEnabled}>
      <Container>
        <Title>{translate('biometry.titleFingerPrint')}</Title>
        <PhotoIcon>
          <MaterialCommunityIcons
            name="fingerprint"
            size={RFValue(100)}
            color={theme.colors.primary}
          />
        </PhotoIcon>

        <Description>
          {translate('biometry.descriptionFingerPrint')}
        </Description>

        <Buttons>
          <ButtonSignIn activeOpacity={0.7} onPress={handleFingerprint}>
            <TextButtonSignIn>
              {translate('biometry.buttonFigerPrint')}
            </TextButtonSignIn>
          </ButtonSignIn>
          <ButtonRecused
            activeOpacity={0.7}
            onPress={async () => {
              setEnabled && setEnabled(false);
              signOut();
            }}
          >
            <TextButton>{translate('biometry.buttonSignOut')}</TextButton>
          </ButtonRecused>
        </Buttons>
      </Container>
    </If>
  );
}
