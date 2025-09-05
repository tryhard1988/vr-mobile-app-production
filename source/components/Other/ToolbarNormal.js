import React, {Component} from 'react'
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native'
import {connect} from 'react-redux'
import Colors from '../../styles/Colors'
import AppText from '../SwitchLanguage/AppText'

export default ToolbarNormal = ({
  titleToolbar,
  onClose,
  rightButton,
  onClickRightButton,
  child,
}) => {
  _close = () => {
    onClose ? onClose() : null
  }

  _onClickRightButton = () => {
    onClickRightButton ? onClickRightButton() : null
  }

  return (
    <View style={styles.containerHeader}>
      <TouchableOpacity onPress={_close} style={styles.buttonBack}>
        <Image
          style={{height: 24, width: 24}}
          source={require('../../../source/assests/images/baseline_keyboard_backspace_black_48dp.png')}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>
        <AppText title={titleToolbar} />
        {child}
      </Text>
      {rightButton && (
        <TouchableOpacity
          onPress={_onClickRightButton}
          style={[styles.buttonBack, {width: 60}]}>
          <Text style={{color: Colors.orange_F68B1F, fontWeight: '700'}}>
            {rightButton}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  containerHeader: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonBack: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    color: Colors.black_22281F,
    fontWeight: '700',
    fontSize: 16,
  },
})
