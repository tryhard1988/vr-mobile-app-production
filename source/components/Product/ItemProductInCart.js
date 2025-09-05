import React, {useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native'
import {set} from 'react-native-reanimated'
import {useSelector} from 'react-redux'
import {convertStringToPrice} from '../../helpers/Utils'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import AppText from '../SwitchLanguage/AppText'

export default ItemProductInCart = ({
  index,
  item,
  onChangeData,
  onClickImage,
  onClickRemove,
}) => {
  const [data, setData] = useState(null)
  const [isChange, setIsChange] = useState(false)
  const cartState = useSelector(state => state.cart)

  useEffect(() => {
    if (item) {
      setData(item)
    }
  }, [item])

  useEffect(() => {
    if (isChange && onChangeData && data?.quantity !== '') {
      onChangeData(index, data)
    }
  }, [data, isChange])

  _handleCheck = () => {
    setIsChange(true)
    setData(preState => {
      return {
        ...preState,
        check: !data.check,
      }
    })
  }

  _handleClickImage = () => {
    if (onClickImage) {
      onClickImage(item?.product_id)
    }
  }

  _inputquantity = value => {
    setIsChange(true)
    if (value == '') {
      setData(preState => {
        return {
          ...preState,
          quantity: '',
        }
      })
    } else {
      if (value == 0) {
        setData(preState => {
          return {
            ...preState,
            quantity: 1,
          }
        })
        if (onClickRemove) {
          onClickRemove(index)
        }
      } else if (value >= 1) {
        setData(preState => {
          return {
            ...preState,
            quantity: parseInt(value),
          }
        })
      } else return
    }
  }

  _handleDecreasequantity = () => {
    setIsChange(true)
    if (data.quantity > 1) {
      setData(preState => {
        return {
          ...preState,
          quantity: data.quantity - 1,
        }
      })
    } else {
      if (onClickRemove) {
        onClickRemove(index)
      }
    }
  }

  _handleIncreasequantity = () => {
    setIsChange(true)
    setData(preState => {
      return {
        ...preState,
        quantity: data.quantity + 1,
      }
    })
  }

  _handleRemove = () => {
    if (onClickRemove) {
      onClickRemove(index)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={_handleCheck}
        activeOpacity={0.5}
        style={{paddingEnd: 10}}>
        <Image
          resizeMode='cover'
          style={{height: 20, width: 20}}
          source={
            data?.check
              ? require('../../assests/images/ic_checked.png')
              : require('../../assests/images/ic_uncheck.png')
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={_handleClickImage}
        activeOpacity={0.5}
        style={styles.imageView}>
        <Image
          resizeMode='cover'
          style={{height: 75, width: 75}}
          source={{uri: data?.product_image}}
        />
      </TouchableOpacity>

      <View style={styles.textView}>
        <TouchableOpacity onPress={_handleClickImage} activeOpacity={0.5}>
          <Text style={styles.textName}>{data?.name}</Text>
        </TouchableOpacity>
        <View style={styles.packView}>
          {data?.variation_name && (
            <AppText style={styles.textPack} title={'weight'} />
          )}
        </View>
        <View
          style={{
            marginHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
            height: 30,
          }}>
          <TouchableOpacity
            onPress={_handleDecreasequantity}
            activeOpacity={0.5}>
            <Image
              style={{height: 25, width: 25}}
              source={require('../../assests/images/ic_decrease_amount.png')}
            />
          </TouchableOpacity>
          <TextInput
            value={data?.quantity.toString()}
            keyboardType='numeric'
            style={{
              minWidth: 40,
              textAlign: 'center',
              paddingHorizontal: 4,
              paddingVertical: 2,
            }}
            onChangeText={_inputquantity}
          />
          <TouchableOpacity
            onPress={_handleIncreasequantity}
            activeOpacity={0.5}>
            <Image
              style={{height: 25, width: 25}}
              source={require('../../assests/images/ic_increase_amount.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      {cartState.isEditCart && (
        <TouchableOpacity
          onPress={_handleRemove}
          activeOpacity={0.5}
          style={{paddingHorizontal: 5}}>
          <Image
            resizeMode='cover'
            style={{height: 20, width: 20}}
            source={require('../../assests/images/ic_remove_item_cart.png')}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  imageView: {
    alignSelf: 'center',
    padding: 1,
    backgroundColor: Colors.gray_E0E0E0,
  },
  textView: {
    flex: 1,
    marginStart: 12,
    justifyContent: 'space-between',
  },
  packView: {
    marginTop: 3,
    padding: 3,
    backgroundColor: Colors.gray_F2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  textPack: {
    color: Colors.gray_828282,
    fontSize: FontSizes.size12,
  },
  textName: {
    color: Colors.black_22281F,
    fontSize: FontSizes.size14,
  },
  textPrice: {
    marginVertical: 2,
  },
})
