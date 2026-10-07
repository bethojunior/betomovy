import reactotron from 'reactotron-react-native';
import { NativeModules } from 'react-native';

const { scriptURL } = NativeModules.SourceCode;
const hostName = scriptURL.split("://")[1].split(":")[0]

reactotron
  .configure({ host: hostName})
  .useReactNative()

export default reactotron;
