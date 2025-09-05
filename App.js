import React, {useEffect} from 'react'
import {StyleSheet, SafeAreaView, StatusBar, View} from 'react-native'
import 'react-native-gesture-handler'
import {Provider} from 'react-redux'
import store from './source/store/Store'
import AppNavigator from './source/helpers/AppNavigator'
import Colors from './source/styles/Colors'
import messaging from '@react-native-firebase/messaging'
import awsconfig from './source/config/awsmobile'
import Amplify, {Logger} from 'aws-amplify'
export const initStore = store()

const STATUSBAR_HEIGHT = StatusBar.currentHeight
const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
)

export default function App () {
  Amplify.configure(awsconfig)
  Logger.LOG_LEVEL = 'DEBUG'

  useEffect(() => {
    requestUserPermission()
  }, [])

  requestUserPermission = async () => {
    const settings = await messaging().requestPermission()
    if (settings) {
    }
  }

  return (
    <Provider store={initStore}>
      <View style={[styles.container]}>
        <MyStatusBar backgroundColor='#45BA7A' barStyle='light-content' />
        <SafeAreaView style={{flex: 1, backgroundColor: '#45BA7A'}}>
          <AppNavigator />
        </SafeAreaView>
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
})
