/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Alert,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {firebase} from '@react-native-firebase/messaging';
import firebaseApp from '@react-native-firebase/app';
import {credentials, config} from './firebaseCredential';
import moment from 'moment';
const Stack = createStackNavigator();

const defaultAppMessaging = firebase.messaging();

const SettingScreen = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.engine}>
          <Text style={styles.footer}>Setting</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const HomeScreen = ({navigation}) => {
  const [token, setToken] = useState('');
  const [apnsToken, setAPNsToken] = useState('');
  useEffect(() => {
    const getToken = async () => {
      const _token = await defaultAppMessaging.getToken();
      console.log('token', _token);
      setToken(_token);
      // defaultAppMessaging.apnsToken = token;
      const tokenAPNs = await defaultAppMessaging.getAPNSToken();
      console.log('tokenAPNs', tokenAPNs);
      setAPNsToken(apnsToken);
    };

    getToken();

    return () => {};
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Settings</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change
                this: {token}
              </Text>
              <Button
                title="Settings"
                onPress={() => navigation.navigate('Settings')}
              />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Apns token: {apnsToken}
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const onMessageHandle = (notification) => {
  const {title, message, data} = notification;
  //
  try {
    PushNotification.localNotification({
      id: moment().unix(),
      title,
      message,
      priority: 'high',
      alertBody: message,
      alertTitle: title,
    });
  } catch (error) {
    console.log('Notification method show error :', error);
  }
};

const App = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Home');

  useEffect(() => {
    const initialize = async () => {
      await firebaseApp.initializeApp(credentials, config);

      //if (!defaultAppMessaging.isDeviceRegisteredForRemoteMessages) {
      await defaultAppMessaging.registerDeviceForRemoteMessages();
      //}

      const authorizationStatus = await defaultAppMessaging.requestPermission({
        alert: true,
        sound: true,
      });
      if (
        authorizationStatus ===
        firebase.messaging.AuthorizationStatus.AUTHORIZED
      ) {
        console.log('User has notification permissions enabled.');
      } else if (
        authorizationStatus ===
        firebase.messaging.AuthorizationStatus.PROVISIONAL
      ) {
        console.log('User has provisional notification permissions.');
      } else {
        console.log('User has notification permissions disabled');
      }
      //
      if (Platform.OS === 'ios') {
        PushNotificationIOS.requestPermissions({
          alert: true,
          sound: true,
        }).then(
          (data) => {
            console.log('PushNotificationIOS.requestPermissions', data);

            setLoading(false);
          },
          (data) => {
            console.log('PushNotificationIOS.requestPermissions failed', data);
          },
        );
      }
      setLoading(false);
    };

    initialize();

    defaultAppMessaging.setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    defaultAppMessaging.onTokenRefresh(async (token) => {
      console.log('onTokenRefresh new token :', token);
    });

    const listenerMessage = defaultAppMessaging.onMessage(
      async (remoteMessage) => {
        console.log('onMessage : ', remoteMessage);
        // if (Platform.OS === 'ios') {
        const {
          notification: _notification,
          data: {notification},
        } = remoteMessage;
        if (!_notification) {
          onMessageHandle({
            title: notification.title,
            message: notification.body,
            data: {},
          });
          return;
        }
        onMessageHandle({
          title: _notification.title,
          message: _notification.body,
          data: {},
        });

        // }
      },
    );

    return listenerMessage;
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
