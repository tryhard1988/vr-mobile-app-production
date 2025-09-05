import React, {useState, useEffect} from 'react'
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import AppText from '../SwitchLanguage/AppText'

export default ProfileCategory = ({title, icon, onClick}) => {
  _handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <TouchableOpacity
      onPress={_handleClick}
      activeOpacity={1}
      style={styles.viewLine}>
      <Image source={icon} style={{height: 20, width: 20}} />
      <AppText style={styles.textLine} title={title} />
      <Image
        source={require('../../assests/images/ic_arrow_right_green.png')}
        style={{height: 20, width: 20}}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  viewLine: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 10,
  },
  textLine: {
    flex: 1,
    paddingStart: 12,
    color: Colors.gray_4F4F4F,
    fontSize: FontSizes.size16,
  },
})
