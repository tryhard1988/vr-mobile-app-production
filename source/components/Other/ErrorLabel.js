import React, {useState, Component} from 'react'
import {connect} from 'react-redux'
import I18n from '../../config/LanguageConfig'
import {StyleSheet, Text, View, Image} from 'react-native'

import Colors from '../../styles/Colors'
import AppText from '../SwitchLanguage/AppText'

export default ErrorLabel = ({message}) => {
  return (
    <View style={styles.containerView}>
      <Image
        style={styles.icon}
        source={require('../../../source/assests/images/ic_error_red.png')}
      />
      <AppText style={styles.errorText} title={message} />
    </View>
  )
}

const styles = StyleSheet.create({
  containerView: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  blackCenterText: {
    color: Colors.material_gray_dark,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
    color: Colors.red_DE3F4E,
    marginTop: 12,
    alignSelf: 'center',
    height: '100%',
  },
  icon: {
    width: 16,
    height: 16,
    marginEnd: 12,
    alignSelf: 'center',
  },
})
