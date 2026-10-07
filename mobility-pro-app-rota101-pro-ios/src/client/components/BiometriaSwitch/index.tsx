// @ts-nocheck
import {useState} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from 'styled-components';
import {Item, ItemRow, Loading, SwitchContainer} from './styles';

import {Switch} from '../Switch';

import {translate} from '../../locales';
import {useAuth} from '../../../context/auth';

export function BiometriaSwitch() {
  const [show, setShow] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    checkDeviceIsSupported,
    biometryIsEnabled,
    deleteBiometry,
    authenticateBiometry,
    saveBiometry,
  } = useAuth();

  const {colors} = useTheme();

  useFocusEffect(() => {
    (async () => {
      const isSupported = await checkDeviceIsSupported();
      setShow(isSupported);

      if (!isSupported) {
        return;
      }

      const isOn = await biometryIsEnabled();
      setIsSwitchOn(isOn);
    })();
  });

  const onToggleSwitch = async () => {
    setLoading(true);
    const isOn = await biometryIsEnabled();

    if (isOn) {
      const authenticated = await authenticateBiometry(
        translate('biometry.sensor'),
      );

      if (!authenticated) {
        setLoading(false);
        return;
      }

      await deleteBiometry();
      setIsSwitchOn(false);
      setLoading(false);
      return;
    }

    const saved = await saveBiometry();

    if (!saved) {
      setLoading(false);
      return;
    }

    setIsSwitchOn(true);
    setLoading(false);
  };

  return show ? (
    <ItemRow>
      <Item>{translate('myProfile.biometry')}</Item>
      <SwitchContainer>
        {loading ? <Loading size="small" color={colors.primary} /> : null}
        <Switch
          enabled={!loading}
          value={isSwitchOn}
          onValueChange={onToggleSwitch}
        />
      </SwitchContainer>
    </ItemRow>
  ) : (
    <></>
  );
}
