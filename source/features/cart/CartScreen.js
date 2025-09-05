import React, {useCallback, useEffect, useState} from 'react'
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native'
import {or} from 'react-native-reanimated'
import {useDispatch, useSelector} from 'react-redux'
import VoucherInput from '../../components/Input/VoucherInput'
import ToolbarNormal from '../../components/Other/ToolbarNormal'
import ItemProductInCart from '../../components/Product/ItemProductInCart'
import {saveCart} from '../../helpers/Storages'
import {convertStringToPrice} from '../../helpers/Utils'
import {handleEditCart} from '../../store/actions/CartActions'
import {handleLoading} from '../../store/actions/UtilsActions'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import I18n from '../../config/LanguageConfig'
import AppText from '../../components/SwitchLanguage/AppText'

export default CartScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)
  const cartState = useSelector(state => state.cart)
  const [cartData, setCartData] = useState([])
  const [checkAll, setCheckAll] = useState(false)
  const [quantityCheck, setQuantityCheck] = useState(0)
  const [orderProducts, setOrderProducts] = useState([])
  const [isEmptyCart, setIsEmptyCart] = useState(false)

  useEffect(() => {
    setCartData(cartState.productsCart)
  }, [cartState.productsCart])

  useEffect(() => {
    if (quantityCheck == cartData.length) {
      setCheckAll(true)
    } else {
      setCheckAll(false)
    }
  }, [quantityCheck, cartData])

  useEffect(() => {
    if (cartData.length > 0) {
      isEmptyCart && setIsEmptyCart(false)
      let productsChecked = []
      let countCheck = 0
      cartData.map(item => {
        if (item.check) {
          countCheck++
          productsChecked.push(item)
        }
      })
      setQuantityCheck(countCheck)
      setOrderProducts(productsChecked)
    } else {
      setIsEmptyCart(true)
      setOrderProducts([])
      dispatch(handleEditCart(false))
    }
  }, [cartData])

  _handleBack = () => {
    dispatch(handleEditCart(false))
    navigation.pop()
  }

  _handleShowProductDetail = data => {
    navigation.push('ProductDetail', {item: data, isGetData: true})
  }

  _handleChangeCartItem = (index, item) => {
    let newData = [...cartData]
    newData[index] = item
    setCartData(newData)
    cartState.productsCart = newData
    saveCart(newData)
    if (item.check) {
      setQuantityCheck(quantityCheck + 1)
    } else setQuantityCheck(quantityCheck - 1)
  }

  _handleRemoveCartItem = index => {
    let newData = [...cartData]
    newData.splice(index, 1)
    setCartData(newData)
    cartState.productsCart = newData
    saveCart(newData)
  }

  _confirmRemoveCartItem = index => {
    Alert.alert(null, I18n.t('delete-product'), [
      {text: I18n.t('no'), onPress: () => {}, style: 'default'},
      {
        text: I18n.t('yes'),
        onPress: () => {
          _handleRemoveCartItem(index)
        },
        style: 'destructive',
      },
    ])
  }

  const _renderCartProductItem = useCallback(
    ({item, index}) => (
      <ItemProductInCart
        index={index}
        item={item}
        onClickImage={_handleShowProductDetail}
        onChangeData={_handleChangeCartItem}
        onClickRemove={_confirmRemoveCartItem}
        itemStyle={[styles.containerProduct]}
        // imageStyle={styles.imageView}
      />
    ),
    [],
  )

  _handleCheckAll = () => {
    let dataNew = [...cartData]
    if (!checkAll) {
      dataNew.map(item => (item.check = true))
      setCartData(dataNew)
    } else {
      dataNew.map(item => (item.check = false))
      setCartData(dataNew)
    }
    setCheckAll(!checkAll)
    cartState.productsCart = dataNew
    saveCart(dataNew)
  }

  _handleUseVoucher = () => {
    dispatch(handleLoading(true))
    setTimeout(() => dispatch(handleLoading(false)), 2000)
  }

  _onClickEdit = () => {
    dispatch(handleEditCart(!cartState.isEditCart))
  }

  _handleContinueOrder = () => {
    if (orderProducts.length > 0) {
      navigation.push('OrderInformation', {
        data: {
          orderProducts: orderProducts,
        },
      })
      dispatch(handleEditCart(false))
    }
  }

  return (
    <View style={styles.container}>
      <ToolbarNormal titleToolbar='cart' onClose={_handleBack} />
      {isEmptyCart ? (
        <View style={styles.emptyView}>
          <Image
            style={{height: 120, width: 139, margin: '5%'}}
            resizeMode={'contain'}
            source={require('../../assests/images/img_cart_empty.png')}
          />
          <AppText style={styles.textEmpty} title={'empty-cart'} />
          <TouchableOpacity onPress={_handleBack} style={styles.buttonBackHome}>
            <AppText style={styles.textBackHome} title={'continue-shopping'} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 16,
              marginVertical: 12,
            }}>
            <AppText style={styles.textTitle} title={'product-info'} />
            <TouchableOpacity
              onPress={_onClickEdit}
              activeOpacity={0.5}
              style={{padding: 4}}>
              <AppText
                style={[styles.textTitle, {color: Colors.green_00A74C}]}
                title={'edit'}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            data={cartData}
            renderItem={_renderCartProductItem}
            keyExtractor={(e, i) => i.toString()}
            extraData={(e, i) => i.toString()}
          />
          {/* <TouchableOpacity activeOpacity={0.5} style={styles.buttonUpdate}>
                            <Text style={{ color: Colors.green_00A74C, fontSize: FontSizes.size14 }}>Cập nhật giỏ hàng</Text>
                        </TouchableOpacity> */}
          {/* <VoucherInput onClickUse={_handleUseVoucher} /> */}
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: Colors.white,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={_handleCheckAll}
              activeOpacity={0.5}
              style={styles.buttonSelectAll}>
              <Image
                source={
                  checkAll
                    ? require('../../assests/images/ic_checked.png')
                    : require('../../assests/images/ic_uncheck.png')
                }
                style={{height: 22, width: 22}}
              />
              <AppText
                style={{paddingStart: 5, color: Colors.gray_4F4F4F}}
                title={'all'}
              />
            </TouchableOpacity>
            {orderProducts.length > 0 ? (
              <TouchableOpacity
                onPress={_handleContinueOrder}
                activeOpacity={0.5}
                style={[styles.buttonBuy]}>
                <AppText
                  style={{paddingHorizontal: 16, color: Colors.white}}
                  title={'buy'}
                />
              </TouchableOpacity>
            ) : (
              <View style={[styles.buttonBuy, {opacity: 0.5}]}>
                <AppText
                  style={{paddingHorizontal: 16, color: Colors.white}}
                  title={'buy'}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  )
}
const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  emptyView: {
    flex: 1,
    paddingVertical: '10%',
    alignItems: 'center',
  },
  textEmpty: {
    color: Colors.gray_4F4F4F,
    fontSize: FontSizes.size16,
    fontWeight: '700',
  },
  buttonBackHome: {
    marginTop: '15%',
    width: '90%',
    height: 40,
    borderRadius: 6,
    backgroundColor: Colors.green_00A74C,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBackHome: {
    fontSize: FontSizes.size14,
    color: Colors.white,
  },
  textTitle: {
    fontSize: FontSizes.size16,
    color: Colors.gray_4F4F4F,
    fontWeight: '700',
  },
  buttonUpdate: {
    borderColor: Colors.green_00A74C,
    borderWidth: 1,
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonSelectAll: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  buttonBuy: {
    height: 40,
    backgroundColor: Colors.green_00A74C,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
})
