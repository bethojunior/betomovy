import React, {createContext, useState, useEffect, useContext} from 'react';
import {WebView} from 'react-native-webview';
import {NetworkPropsContext} from './types';
import {Linking, View} from 'react-native';
import {NetWorkAlert} from '../NetWorkAlert';
import {TargetAlert} from '../TargetAlert';
import {If} from '../../client/components/If';
import {isBeta} from '../../constantBuild/config';
import {ConfigGlobalServices} from './services';
import {SwalAlert} from '../../client/components/SwalAlert';
import Constants from 'expo-constants';
import {translate} from '../../client/locales';
import {AppsId} from './constants';

export const ConfigGlobalContext = createContext({} as NetworkPropsContext);

export const ConfigGlobalProvider = ({children}) => {
  const [itsNetwork, setItsNetwork] = useState(true);
  const [betaEnd, setBetaEnd] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [linkUpdate, setLinkUpdate] = useState('' as string);
  const [versionApp, setVersionApp] = useState('' as string);

  const onMessage = event => {
    if (event?.nativeEvent?.data === 'online') {
      setItsNetwork(true);
    } else if (event?.nativeEvent?.data === 'offline') {
      setItsNetwork(false);
    }
  };

  const checkVersionMobilityPro = async () => {
    const data = await ConfigGlobalServices.checkVersion(
      AppsId['MOBILITY PRO'],
    );
    if (!data?.status) {
      return;
    }
    const {update, version} = data?.data;
    setVersionApp(version?.version);

    if (update) {
      setNeedUpdate(true);
      setLinkUpdate(version?.link);
      return;
    }
    setNeedUpdate(false);
  };

  useEffect(() => {
    checkVersionMobilityPro();
  }, []);

  return (
    <ConfigGlobalContext.Provider
      value={{itsNetwork, setItsNetwork, betaEnd, needUpdate, versionApp}}
    >
      <If condition={needUpdate}>
        <SwalAlert
          visible={needUpdate}
          description={translate(
            'configGlobal.A_new_version_of_name_is_available_Please_update_the_app',
          ).replace('{name}', Constants?.manifest?.name)}
          textButton={translate('configGlobal.update')}
          callBack={() => {
            Linking.openURL(linkUpdate);
          }}
          title={translate('configGlobal.needs_update')}
        />
      </If>
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
      <View
        style={{
          width: 1,
          height: 1,
          position: 'absolute',
        }}
      >
        <WebView
          source={{
            html: `
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
        </head>
        <body>
          
          <script>
            window.addEventListener('online', function () {
              window.ReactNativeWebView.postMessage('online');
            });
            window.addEventListener('offline', function () {
              window.ReactNativeWebView.postMessage('offline');
            });
            // Check the initial network status
            if (navigator.onLine) {
              window.ReactNativeWebView.postMessage('online');
            } else {
              window.ReactNativeWebView.postMessage('offline');
            }
          </script>
        </body>
      </html>
      
        `,
          }}
          onMessage={onMessage}
          onError={() => {
            setItsNetwork(false);
          }}
          onHttpError={() => {
            setItsNetwork(false);
          }}
          style={{flex: 1}}
          containerStyle={{flex: 1}}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={true}
          allowsBackForwardNavigationGestures={true}
          allowsLinkPreview={true}
          allowsPictureInPictureMediaPlayback={true}
          allowsWebContentPlayback={true}
        />
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
