import {NativeModules} from 'react-native';
import {isDevice, modelName} from 'expo-device';
import {UseReactNativeOptions} from 'reactotron-react-native';

export const reactotronReactNativeConfig: UseReactNativeOptions = {
  networking: {
    ignoreUrls: /symbolicate|logs/,
  },
  editor: false,
  errors: {veto: stackFrame => false},
};

export const host = getHostName();
export const name = getName();

function getHostName() {
  const {getConstants} = NativeModules.SourceCode;
  return getConstants()?.scriptURL?.split('://')[1]?.split(':')[0];
}

function getName() {
  return `${modelName} (${isDevice ? 'device' : 'simulator'}) - Mobility App`;
}
