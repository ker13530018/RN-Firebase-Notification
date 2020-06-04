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
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
// import moment from 'moment';
// import messaging from '@react-native-firebase/messaging';
import {firebase} from '@react-native-firebase/messaging';
import firebaseApp from '@react-native-firebase/app';
import NotificationModule from './NotificationModule';
import {credentials, config} from './firebaseCredential';
const Stack = createStackNavigator();

const defaultAppMessaging = firebase.messaging();

const requestUserPermission = async () => {
  PushNotificationIOS.requestPermissions({
    alert: true,
    badge: true,
    sound: true,
  });
  const authorizationStatus = await defaultAppMessaging.requestPermission({
    provisional: true,
    sound: true,
    announcement: true,
  });

  if (
    authorizationStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED
  ) {
    console.log('User has notification permissions enabled.');
  } else if (
    authorizationStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL
  ) {
    console.log('User has provisional notification permissions.');
    //
  } else {
    console.log('User has notification permissions disabled');
  }
};

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
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
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
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const onMessageHandle = (from, message) => {
  const {
    data: {
      notification: {title, body},
    },
  } = message;
  //
  console.log(`message from ${from} messaging onMessage :`, message);
  //
  if (from === 'normal') {
    Alert.alert(title, body);
  }

  try {
    NotificationModule.Show(1, title, body);
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

      await requestUserPermission();

      defaultAppMessaging.onNotificationOpenedApp((remoteMessage) => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );
        navigation.navigate(remoteMessage.data.type);
      });

      defaultAppMessaging.getInitialNotification().then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          setInitialRoute('Settings'); // e.g. "Settings"
        }
        console.log('getInitialNotification...');
        setLoading(false);
      });

      defaultAppMessaging.onMessage((msg) => onMessageHandle('normal', msg));
    };
    const getFirebaseToken = async () => {
      // await firebase.messaging().registerDeviceForRemoteMessages();
      const token = await defaultAppMessaging.getToken();
      console.log('getFirebaseToken :', token);
      const keys = await AsyncStorage.getAllKeys();
      console.log('AsyncStorage keys :', keys);
    };

    initialize().then(() => {
      getFirebaseToken();
    });
    //
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
