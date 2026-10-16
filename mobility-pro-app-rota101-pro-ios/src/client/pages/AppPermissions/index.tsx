import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Platform, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { Container } from './styles';
import { PermissionStep } from './steps/PermissionStep';
import { useAppPermissionsSteps } from './useAppPermissionsSteps';

import { If } from '../../components/If';
import { translate } from '../../locales';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { TripRoutesParamList } from '~/client/routes/types';

type NavigationProps = StackNavigationProp<TripRoutesParamList, 'AppPermissions'>;

export default function AppPermissions() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProps>();

  const { steps, stepWidth, isLastStep, scrollRef, goToNextStep } = useAppPermissionsSteps();
  const { requestPermission, checkPermission } = useBubbleButton();

  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [checkingCurrentPermission, setCheckingCurrentPermission] = useState(true);

  const finishAppPermissions = () => {
    navigation.replace('Home');
  };

  useEffect(() => {
    if (Platform.OS !== 'android') {
      finishAppPermissions();
      return;
    }

    checkPermission().then((alreadyGranted) => {
      if (alreadyGranted) {
        finishAppPermissions();
      } else {
        setCheckingCurrentPermission(false);
      }
    });
  }, []);

  const handleAcceptBackgroundExecution = async () => {
    setIsRequestingPermission(true);
    try {
      await requestPermission();
    } finally {
      setIsRequestingPermission(false);
      if (isLastStep) {
        finishAppPermissions();
      } else {
        goToNextStep();
      }
    }
  };

  if (checkingCurrentPermission) {
    return <Container />;
  }

  return (
    <Container>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <If condition={steps.includes('background')}>
          <PermissionStep
            width={stepWidth}
            icon={
              <Feather name="layers" size={RFValue(28)} color={theme.colors.secondary} />
            }
            title={translate('appPermissions.title_background')}
            descriptions={[
              translate('appPermissions.description_background_1'),
              translate('appPermissions.description_background_2'),
            ]}
            buttonTitle={translate('welcomeSpeedmob.text_button_next')}
            onPress={handleAcceptBackgroundExecution}
            loading={isRequestingPermission}
            closeButtonTitle={translate('appPermissions.button_remind_later')}
            onClose={finishAppPermissions}
          />
        </If>
      </ScrollView>
    </Container>
  );
}
