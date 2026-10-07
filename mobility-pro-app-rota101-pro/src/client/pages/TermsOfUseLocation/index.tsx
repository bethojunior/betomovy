import { Fragment, useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { Container } from './styles';
import { PermissionStep } from './steps/PermissionStep';
import { TermsStep } from './steps/TermsStep';
import { useOnboardingSteps } from './useOnboardingSteps';
import { useOnboardingPermissions } from './useOnboardingPermissions';

import { If } from '../../components/If';
import { translate } from '../../locales';
import { buildApp, nameApp } from '../../../constantBuild/config';
import apiMain from '../../api/apiMain';
import { useModules } from '../../contexts/modules';
import { useTerms } from '../../../context/terms';
import TermsCheckSpeedMob from '../SpeedMob/TermsCheckSpeedMob';

export default function TermsOfUseLocation() {
  const { init } = useModules();
  const { acceptTerms } = useTerms();
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { APP_PARTNER } = buildApp();

  const { steps, stepWidth, scrollRef, goToNextStep } = useOnboardingSteps();
  const {
    requestLocationPermission,
    requestContactsPermission,
    requestCameraPermission,
    requestMicrophonePermission,
  } = useOnboardingPermissions();

  const [loading, setLoading] = useState(false);
  const [checkTerms, setCheckTerms] = useState(false);
  const [descriptionTerms, setDescriptionTerms] = useState('');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  useEffect(() => {
    const getTextTerms = async () => {
      setLoading(true);
      try {
        const response = await apiMain.get('termsUsePolicy/findByType?type=partner');
        setDescriptionTerms(response.data.data.description);
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    };

    getTextTerms();
  }, []);

  const finishOnboarding = () => {
    acceptTerms(true);

    if (APP_PARTNER) {
      navigation.navigate('SelectAppPartners', { replace: true });
      return;
    }

    navigation.navigate('SignIn', { replace: true });
  };

  const handleAcceptLocation = async () => {
    setIsRequestingPermission(true);
    try {
      await requestLocationPermission();
      goToNextStep();
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleAcceptContacts = async () => {
    setIsRequestingPermission(true);
    try {
      await requestContactsPermission();
      goToNextStep();
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleAcceptCamera = async () => {
    setIsRequestingPermission(true);
    try {
      await requestCameraPermission();
      goToNextStep();
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleAcceptMicrophone = async () => {
    setIsRequestingPermission(true);
    try {
      await requestMicrophonePermission();
      goToNextStep();
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleAcceptTerms = () => {
    finishOnboarding();
  };

  return (
    <Fragment>
      {init !== 'Speedmob' && (
        <Container>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <If condition={steps.includes('localization')}>
              <PermissionStep
                width={stepWidth}
                icon={<Feather name="map-pin" size={RFValue(28)} color={theme.colors.secondary} />}
                title={translate('welcomeSpeedmob.title_localization')}
                descriptions={[
                  translate('welcomeSpeedmob.description_localization_1')?.replace(
                    'SpeedMob',
                    nameApp,
                  ),
                  translate('welcomeSpeedmob.description_localization_2'),
                ]}
                buttonTitle={translate('welcomeSpeedmob.text_button_next')}
                onPress={handleAcceptLocation}
                loading={isRequestingPermission}
              />
            </If>

            <PermissionStep
              width={stepWidth}
              icon={
                <Feather name="users" size={RFValue(28)} color={theme.colors.secondary} />
              }
              title={translate('welcomeSpeedmob.title_contacts')}
              descriptions={[
                translate('welcomeSpeedmob.description_contacts_1'),
                translate('welcomeSpeedmob.description_contacts_2'),
              ]}
              buttonTitle={translate('welcomeSpeedmob.text_button_next')}
              onPress={handleAcceptContacts}
              loading={isRequestingPermission}
            />

            <PermissionStep
              width={stepWidth}
              icon={
                <Feather name="camera" size={RFValue(28)} color={theme.colors.secondary} />
              }
              title={translate('welcomeSpeedmob.title_camera')}
              descriptions={[
                translate('welcomeSpeedmob.description_camera_1'),
                translate('welcomeSpeedmob.description_camera_2'),
              ]}
              buttonTitle={translate('welcomeSpeedmob.text_button_next')}
              onPress={handleAcceptCamera}
              loading={isRequestingPermission}
            />

            <PermissionStep
              width={stepWidth}
              icon={
                <Feather name="mic" size={RFValue(28)} color={theme.colors.secondary} />
              }
              title={translate('welcomeSpeedmob.title_microphone')}
              descriptions={[
                translate('welcomeSpeedmob.description_microphone_1'),
                translate('welcomeSpeedmob.description_microphone_2'),
              ]}
              buttonTitle={translate('welcomeSpeedmob.text_button_next')}
              onPress={handleAcceptMicrophone}
              loading={isRequestingPermission}
            />

            <TermsStep
              width={stepWidth}
              loading={loading}
              checkTerms={checkTerms}
              descriptionTerms={descriptionTerms}
              onCheckTerms={() => setCheckTerms((prev) => !prev)}
              onAcceptTerms={handleAcceptTerms}
            />
          </ScrollView>
        </Container>
      )}
      {init === 'Speedmob' && <TermsCheckSpeedMob />}
    </Fragment>
  );
}
