/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

// Refresh token
messaging().onTokenRefresh((token) => {
  console.log('onTokenRefresh new token :', token);
});

AppRegistry.registerComponent(appName, () => App);
