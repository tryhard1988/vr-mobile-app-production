import React, {useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import {useSelector} from 'react-redux'

export default ItemProduct = ({
  data,
  onClickItem,
  isAdd = true,
  onClickAdd,
  itemStyle,
  imageStyle,
  byTag = false,
}) => {
  const productsState = useSelector(state => state.products)

  _handleClick = () => {
    if (onClickItem) {
      onClickItem(data)
    }
  }

  _handleAdd = () => {
    if (onClickAdd) {
      if (data?.attributes?.length > 0 || data?.variation?.length > 0) {
        onClickAdd(false, data)
      } else onClickAdd(true, data)
    }
  }

  const _renderListPack = useCallback(() => {
    let text = ''
    if (byTag) {
      if (data?.variation.length > 0) {
        data?.variation.forEach((e, i) => {
          if (i == data?.variation.length - 1) {
            text = text + e
          } else text = text + e + ' • '
        })
      }
    } else {
      if (data?.attributes.length > 0) {
        if (data?.attributes[0]?.options.length > 0) {
          data?.attributes[0]?.options.forEach((e, i) => {
            if (i == data?.attributes[0]?.options.length - 1) {
              text = text + e
            } else text = text + e + ' • '
          })
        }
      }
    }
    return (
      <Text numberOfLines={1} style={styles.textPack}>
        {text}
      </Text>
    )
  }, [])

  return byTag ? (
    <TouchableOpacity
      style={itemStyle}
      activeOpacity={0.5}
      onPress={_handleClick}>
      <Image
        resizeMode='cover'
        style={imageStyle}
        source={data?.img_url && {uri: data.img_url}}
      />
      <Text numberOfLines={2} style={styles.textName}>
        {data?.title}
      </Text>
      <View style={styles.linePrice}>
        {_renderListPack()}
        {isAdd && (
          <TouchableOpacity
            onPress={_handleAdd}
            style={styles.containerButtonAdd}>
            <Image
              resizeMode='contain'
              style={{height: 30, width: 30}}
              source={require('../../assests/images/ic_add_circle_green.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={itemStyle}
      activeOpacity={0.5}
      onPress={_handleClick}>
      <Image
        resizeMode='cover'
        style={imageStyle}
        source={data?.images.length > 0 && {uri: data?.images[0]?.src}}
      />
      <Text numberOfLines={2} style={styles.textName}>
        {data?.name}
      </Text>
      <View style={styles.linePrice}>
        {_renderListPack()}
        {isAdd && (
          <TouchableOpacity
            onPress={_handleAdd}
            style={styles.containerButtonAdd}>
            <Image
              resizeMode='contain'
              style={{height: 30, width: 30}}
              source={require('../../assests/images/ic_add_circle_green.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  textName: {
    marginTop: 5,
    marginHorizontal: 5,
    height: 35,
    fontSize: FontSizes.size14,
    fontWeight: '700',
    color: Colors.black_22281F,
  },
  textPack: {
    flex: 1,
    marginStart: 5,
    marginBottom: 10,
    fontSize: FontSizes.size12,
    fontWeight: 'normal',
    color: Colors.gray_828282,
  },
  textPrice: {
    flex: 1,
    marginHorizontal: 5,
    fontSize: FontSizes.size16,
    fontWeight: '700',
    color: Colors.orange_F68B1F,
  },
  containerButtonAdd: {
    paddingBottom: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linePrice: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
