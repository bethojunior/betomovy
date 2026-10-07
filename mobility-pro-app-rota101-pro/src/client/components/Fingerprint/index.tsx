import { Fragment, useRef, useEffect, useState, ComponentProps } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { RFValue } from 'react-native-responsive-fontsize';

import {
  Container,
  Content,
  Title,
  Subtitle,
  AuthArea,
  PulseRing,
  IconCircle,
  IconBadge,
  StatusTitle,
  StatusHint,
  InfoCard,
  InfoIconBadge,
  InfoTextColumn,
  InfoTitle,
  InfoDescription,
  MethodsSection,
  MethodsSectionLabel,
  MethodsRow,
  MethodOption,
  MethodDivider,
  MethodIconBadge,
  MethodLabel,
  Footer,
  FooterText,
} from './styles';
import theme from '../../styles/theme';
import { translate } from '../../locales';
import { useAuth } from '../../../context/auth';
import { FingerprintProps, FingerprintStatus } from './types';

const METHOD_OPTIONS: Record<
  number,
  { icon: ComponentProps<typeof MaterialCommunityIcons>['name']; label: string }
> = {
  [LocalAuthentication.AuthenticationType.FINGERPRINT]: {
    icon: 'fingerprint',
    label: 'biometry.useFingerprintMethod',
  },
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: {
    icon: 'face-recognition',
    label: 'biometry.useFaceMethod',
  },
  [LocalAuthentication.AuthenticationType.IRIS]: {
    icon: 'eye-outline',
    label: 'biometry.useIrisMethod',
  },
};

export function Fingerprint({ setEnabled, onPress, setEnabledBiometry }: FingerprintProps) {
  const { setRequestFingerprint, authenticateBiometry, setOfferBiometry } = useAuth();

  const triedOnce = useRef(false);
  const [status, setStatus] = useState<FingerprintStatus>('waiting');
  const [supportedTypes, setSupportedTypes] = useState<LocalAuthentication.AuthenticationType[]>([]);

  useEffect(() => {
    LocalAuthentication.supportedAuthenticationTypesAsync().then(setSupportedTypes);
  }, []);

  useEffect(() => {
    if (!triedOnce.current) {
      triedOnce.current = true;
      handleFingerprint();
    }
  }, []);

  const handleFingerprint = async () => {
    setStatus('waiting');

    const result = await authenticateBiometry();
    if (result) {
      if (onPress) {
        await onPress();
      }
      setEnabled?.(false);
      setRequestFingerprint(false);
      return;
    }

    setStatus('failed');
    await AsyncStorage.removeItem('biometry_switch');
    setEnabled?.(false);
    setEnabledBiometry?.(false);
    setOfferBiometry(false);
    setRequestFingerprint(false);
  };

  if (setEnabled) {
    return null;
  }

  const failed = status === 'failed';
  const hasFingerprint = supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
  const waitingHintKey = hasFingerprint ? 'biometry.waitingHint' : 'biometry.waitingHintFace';

  return (
    <Container>
      <Content>
        <Title>{translate('biometry.titleFingerPrint')}</Title>
        <Subtitle>{translate('biometry.subtitleFingerPrint')}</Subtitle>

        <AuthArea>
          {!failed && (
            <>
              <PulseRing
                from={{ opacity: 0.35, scale: 1 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ type: 'timing', duration: 1800, loop: true }}
              />
              <PulseRing
                from={{ opacity: 0.45, scale: 1 }}
                animate={{ opacity: 0, scale: 1.3 }}
                transition={{ type: 'timing', duration: 1800, loop: true, delay: 400 }}
              />
            </>
          )}

          <IconCircle activeOpacity={0.8} onPress={handleFingerprint}>
            <MaterialCommunityIcons name="fingerprint" size={RFValue(56)} color={theme.colors.primary} />

            <IconBadge failed={failed}>
              <MaterialCommunityIcons name="shield-lock" size={RFValue(20)} color={theme.colors.primaryText} />
            </IconBadge>
          </IconCircle>
        </AuthArea>

        <StatusTitle failed={failed}>
          {translate(failed ? 'biometry.retryAuthentication' : 'biometry.waitingAuthentication')}
        </StatusTitle>
        <StatusHint>{translate(failed ? 'biometry.retryAuthenticationHint' : waitingHintKey)}</StatusHint>

        <InfoCard>
          <InfoIconBadge>
            <Ionicons name="shield-checkmark-outline" size={RFValue(16)} color={theme.colors.white} />
          </InfoIconBadge>
          <InfoTextColumn>
            <InfoTitle>{translate('biometry.securityTitle')}</InfoTitle>
            <InfoDescription>{translate('biometry.securityDescription')}</InfoDescription>
          </InfoTextColumn>
        </InfoCard>

        {supportedTypes.length > 1 && (
          <MethodsSection>
            <MethodsSectionLabel>{translate('biometry.otherMethodsLabel')}</MethodsSectionLabel>

            <MethodsRow>
              {supportedTypes.map((type, index) => {
                const option = METHOD_OPTIONS[type];

                if (!option) {
                  return null;
                }

                return (
                  <Fragment key={type}>
                    {index > 0 && <MethodDivider />}
                    <MethodOption activeOpacity={0.7} onPress={handleFingerprint}>
                      <MethodIconBadge>
                        <MaterialCommunityIcons name={option.icon} size={RFValue(16)} color={theme.colors.primary} />
                      </MethodIconBadge>
                      <MethodLabel numberOfLines={2}>{translate(option.label)}</MethodLabel>
                    </MethodOption>
                  </Fragment>
                );
              })}
            </MethodsRow>
          </MethodsSection>
        )}
      </Content>

      <Footer>
        <Ionicons name="lock-closed-outline" size={RFValue(12)} color={theme.colors.text_gray} />
        <FooterText>{translate('biometry.footerProtection')}</FooterText>
      </Footer>
    </Container>
  );
}
