// console.log('🔥 App.js is running');

// import React, {useEffect} from 'react';
// import {StyleSheet, SafeAreaView, StatusBar, View} from 'react-native';
// import 'react-native-gesture-handler';
// import {Provider} from 'react-redux';
// import store from './source/store/Store';
// import AppNavigator from './source/helpers/AppNavigator';
// import Colors from './source/styles/Colors';
// import messaging from '@react-native-firebase/messaging';
// import awsconfig from './source/config/awsmobile';
// import Amplify, {Logger} from 'aws-amplify';

// export const initStore = store();

// const STATUSBAR_HEIGHT = StatusBar.currentHeight;

// const MyStatusBar = ({backgroundColor, ...props}) => (
//   <View style={[styles.statusBar, {backgroundColor}]}>
//     <SafeAreaView>
//       <StatusBar translucent backgroundColor={backgroundColor} {...props} />
//     </SafeAreaView>
//   </View>
// );

// export default function App () {
//   console.log('🚀 App.js được import'); // <-- log kiểm tra
//   Amplify.configure(awsconfig);
//   Logger.LOG_LEVEL = 'DEBUG';

//   useEffect(() => {
//     console.log('🟢 useEffect chạy - kiểm tra requestUserPermission');
//     requestUserPermission();
//   }, []);

//   const requestUserPermission = async () => {
//     console.log('📲 requestUserPermission gọi');
//     const settings = await messaging().requestPermission();
//     console.log('📡 Permissions:', settings);
//     if (settings) {
//       console.log('✅ User granted messaging permissions');
//     } else {
//       console.log('❌ User declined messaging permissions');
//     }
//   };

//   return (
//     <Provider store={initStore}>
//       <View style={[styles.container]}>
//         <MyStatusBar backgroundColor='#45BA7A' barStyle='light-content' />
//         <SafeAreaView style={{flex: 1, backgroundColor: '#45BA7A'}}>
//           <AppNavigator />
//         </SafeAreaView>
//       </View>
//     </Provider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   statusBar: {
//     height: STATUSBAR_HEIGHT,
//   },
// });

// App.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native';

console.log('🔥 App.js is loaded');

export default function App() {
  useEffect(() => {
    console.log('🟢 useEffect chạy - App.js');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.inner}>
        <Text style={styles.text}>🚀 App.js is running!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});
