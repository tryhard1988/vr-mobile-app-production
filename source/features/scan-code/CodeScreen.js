import React from 'react'
import {View, StyleSheet} from 'react-native'
import {NavScanCodeTopTabs} from '../../helpers/AppNavigator'
import Colors from '../../styles/Colors'
import AppText from '../../components/SwitchLanguage/AppText'

export default CodeScreen = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={{padding: 10, backgroundColor: Colors.white}}>
        <AppText
          style={{
            color: Colors.black_22281F,
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '700',
          }}
          title={'qr-search-info'}
        />
      </View>
      <NavScanCodeTopTabs />
    </View>
  )
}
