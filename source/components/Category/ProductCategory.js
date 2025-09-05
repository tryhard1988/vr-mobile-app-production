import React, {useState, useEffect} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'

export default ProductCategory = ({item, itemSelect, onClick}) => {
  _handleClick = () => {
    if (onClick) {
      onClick(item)
    }
  }

  return (
    <TouchableOpacity style={[styles.containerItem]} onPress={_handleClick}>
      <Text
        style={[
          styles.textTitleItem,
          itemSelect == item.id
            ? styles.textItemSelected
            : styles.textItemNormal,
        ]}>
        {item?.name}
      </Text>
      {itemSelect == item.id && <View style={styles.viewItemSelect} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  containerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 8,
  },
  textTitleItem: {
    fontSize: FontSizes.size16,
    color: Colors.grayA6,
  },
  textItemSelected: {
    color: Colors.gray_4F4F4F,
    fontWeight: '700',
  },
  textItemNormal: {
    color: Colors.gray_828282,
    fontWeight: 'normal',
  },
  viewItemSelect: {
    width: 45,
    height: 2,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: Colors.green_00A74C,
    position: 'absolute',
    bottom: 0,
    alignContent: 'center',
  },
})
