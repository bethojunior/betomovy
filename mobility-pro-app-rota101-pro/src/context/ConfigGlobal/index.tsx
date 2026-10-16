import { createContext, useState, useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { NetworkPropsContext } from './types';
import { Linking, Platform, View } from 'react-native';
import { NetWorkAlert } from '../NetWorkAlert';
import { TargetAlert } from '../TargetAlert';
import { If } from '../../client/components/If';
import { isBeta } from '../../constantBuild/config';
import { ConfigGlobalServices } from './services';
import { AppUpdateModal } from '../../components/AppUpdateModal';
import Constants from 'expo-constants';
import { translate } from '../../client/locales';
import { AppsId } from './constants';
import { buildApp } from '../../constantBuild/config';

export const ConfigGlobalContext = createContext({} as NetworkPropsContext);

function isVersionNewer(targetVersion?: string, currentVersion?: string): boolean {
  if (!targetVersion || !currentVersion) return false;

  const parse = (v: string) =>
    v.split('.').map(n => parseInt(n.replace(/\D/g, ''), 10) || 0);

  const targetParts = parse(targetVersion);
  const currentParts = parse(currentVersion);

  const maxLength = Math.max(targetParts.length, currentParts.length);
  for (let i = 0; i < maxLength; i++) {
    const t = targetParts[i] || 0;
    const c = currentParts[i] || 0;
    if (t > c) return true;
    if (t < c) return false;
  }
  return false;
}

export const ConfigGlobalProvider = ({ children }) => {
  const [itsNetwork, setItsNetwork] = useState(true);
  const [betaEnd, setBetaEnd] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [linkUpdate, setLinkUpdate] = useState('' as string);
  const [versionApp, setVersionApp] = useState('' as string);
  const { IS_APP_DEMO } = buildApp();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setItsNetwork(state.isConnected === true && state.isInternetReachable !== false);
    });

    return unsubscribe;
  }, []);

  const checkVersionMobilityPro = async () => {
    try {
      const data = await ConfigGlobalServices.checkVersion(AppsId['MOBILITY PRO']);
      if (!data?.status || !data?.data) {
        setNeedUpdate(false);
        return;
      }
      const { update, version } = data.data;

      // Se o backend não exigir update ou não fornecer objeto de versão válido, não bloqueia
      if (!update || !version || !version?.version) {
        setNeedUpdate(false);
        return;
      }

      setVersionApp(version.version);

      const currentVersion =
        Constants.expoConfig?.version ||
        Constants.nativeAppVersion ||
        '8.1.2';
      const targetVersion = version.version;

      const isNewer = isVersionNewer(targetVersion, currentVersion);

      if (isNewer) {
        const defaultStoreLink = Platform.select({
          android: 'https://play.google.com/store/apps/details?id=br.com.client.rota101',
          ios: 'https://apps.apple.com/app/id6474148440',
          default: '',
        });
        setLinkUpdate(version?.link || defaultStoreLink || '');
        setNeedUpdate(true);
      } else {
        setNeedUpdate(false);
      }
    } catch (error) {
      console.log('Erro ao checar versão do aplicativo:', error);
      setNeedUpdate(false);
    }
  };

  useEffect(() => {
    checkVersionMobilityPro();
  }, []);

  return (
    <ConfigGlobalContext.Provider
      value={{ itsNetwork, setItsNetwork, betaEnd, needUpdate, versionApp }}
    >
      <AppUpdateModal
        visible={needUpdate && !IS_APP_DEMO}
        title={translate('configGlobal.needs_update')}
        description={translate(
          'configGlobal.A_new_version_of_name_is_available_Please_update_the_app',
        ).replace('{name}', Constants?.expoConfig?.name || 'Movy')}
        onPressUpdate={() => {
          if (linkUpdate) {
            Linking.openURL(linkUpdate).catch(() => {});
          }
        }}
        onClose={() => setNeedUpdate(false)}
      />
      <View
        style={{
          width: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <If condition={isBeta}>
          <TargetAlert betaEnd={betaEnd} setBetaEnd={setBetaEnd} />
        </If>
        <NetWorkAlert itsNetwork={itsNetwork} />
      </View>
      {children}
    </ConfigGlobalContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(ConfigGlobalContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
