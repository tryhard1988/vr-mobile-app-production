import React, {useEffect, useState, useRef} from 'react'
import {Text, StyleSheet, View, Image, ScrollView} from 'react-native'
import Colors from '../../styles/Colors'
import ToolbarNormal from '../../components/Other/ToolbarNormal'
import {versionApp} from '../../config/ApiConfig'
import AppText from '../../components/SwitchLanguage/AppText'

export default AppInformationScreen = ({navigation}) => {
  _handleBack = () => {
    navigation.pop()
  }

  return (
    <View style={styles.container}>
      <ToolbarNormal titleToolbar='about' onClose={_handleBack} />
      <ScrollView style={{flex: 1, padding: 16, marginTop: 8}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require('../../assests/images/ic_logo.png')}
            resizeMode='cover'
            style={{width: 103, height: 83}}
          />
          <Text style={styles.textInfo}>
            <AppText title={'version'} /> {versionApp}
          </Text>
          <AppText
            style={{
              marginVertical: 12,
              fontSize: 20,
              color: Colors.black_22281F,
              fontWeight: '700',
            }}
            title={'com-name'}
          />
        </View>
        <View style={{marginVertical: 4}}>
          <AppText
            style={{
              fontSize: 16,
              color: Colors.black_22281F,
              fontWeight: '700',
              marginVertical: 2,
            }}
            title={'com-info'}
          />
          <AppText
            style={{
              fontSize: 14,
              color: Colors.black_22281F,
              marginVertical: 2,
            }}
            title={'com-name-detail'}
          />
          <View style={{height: 8}} />
          <AppText
            style={{
              fontSize: 16,
              color: Colors.black_22281F,
              fontWeight: '700',
              marginVertical: 2,
            }}
            title={'contact'}
          />
          <AppText
            style={{
              fontSize: 14,
              color: Colors.black_22281F,
              marginVertical: 2,
            }}
            title={'com-contact'}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  textInfo: {
    marginVertical: 10,
    color: Colors.gray_828282,
  },
})
