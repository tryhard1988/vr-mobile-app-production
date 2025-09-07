/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Firebase Messaging
import messaging from '@react-native-firebase/messaging';

// Background message handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('🚀 Background Message received:', remoteMessage);
// });

console.log('✅ index.js loaded, App registered==1===index.js');
//import messaging from '@react-native-firebase/messaging';

console.log('✅ index.js loaded, App registered===2==index.js');
//messaging().setBackgroundMessageHandler(async (remoteMessage) => {});

console.log('✅ index.js loaded, App registered===3==index.js');
AppRegistry.registerComponent(appName, () => App);
console.log('✅ index.js loaded, App registered==4===index.js');