import React, {useEffect, useState, useRef} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import Colors from '../../styles/Colors'
import I18n from '../../config/LanguageConfig'
import FontSizes from '../../styles/FontSizes'
import ItemNotification from '../../components/Notification/ItemNotification'
import AppText from '../../components/SwitchLanguage/AppText'

export default NotificationScreen = () => {
  return (
    <View style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{padding: 10, backgroundColor: Colors.white}}>
        <AppText
          style={{
            color: Colors.black_22281F,
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '700',
          }}
          title={'noti-tab'}
        />
      </View>
      <AppText
        style={{
          marginTop: 100,
          color: Colors.gray_828282,
          textAlign: 'center',
        }}
        title={'func-under-dev'}
      />

      {/* <ItemNotification /> */}
      {/* <ItemNotification /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
})
