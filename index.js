/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

if (messaging) {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('🟢 Background message received:', remoteMessage);
  });
}

AppRegistry.registerComponent(appName, () => App);
