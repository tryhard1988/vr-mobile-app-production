import React, {useState, useEffect} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'

export default CategoryMenuButton = ({value, color, onClick, customStyle}) => {
  _handleClick = () => {
    if (onClick) {
      onClick(value?.id)
    }
  }

  return (
    <TouchableOpacity onPress={_handleClick}>
      <View
        style={[styles.containerButton, {backgroundColor: color}, customStyle]}>
        {/* <Image
                    resizeMode='contain'
                    style={{ width: 35, height: 35 }}
                    source={value.icon}
                /> */}
        <Text numberOfLines={2} style={styles.textTitle}>
          {value.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  containerButton: {
    height: 45,
    paddingHorizontal: 8,
    width: 100,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    // marginTop: 6,
    textAlign: 'center',
    fontSize: FontSizes.size14,
    color: Colors.white,
  },
})
