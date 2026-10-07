import reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {host, name, reactotronReactNativeConfig} from './config';

reactotron
  .setAsyncStorageHandler(AsyncStorage)
  .configure({host, name})
  .useReactNative(reactotronReactNativeConfig)
  .connect();

export default reactotron;
