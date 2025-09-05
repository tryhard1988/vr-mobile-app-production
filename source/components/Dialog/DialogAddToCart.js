import React, {useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import ItemPack from '../Product/ItemPack'
import AppText from '../SwitchLanguage/AppText'

export default DialogAddToCart = React.memo(
  ({
    modalVisible,
    closeDialog,
    data,
    packing,
    listPacking,
    isBuy = false,
    isTag = false,
    handleAction,
  }) => {
    const [amout, setAmout] = useState(1)
    const [packSelected, setPackSelected] = useState(null)

    useEffect(() => {
      if (modalVisible == false) {
        setAmout(1)
        setPackSelected(packing)
      }
    }, [modalVisible])

    useEffect(() => {
      if (packing) {
        setPackSelected(packing)
      }
    }, [packing])

    useEffect(() => {
      if (listPacking?.length > 0) {
        setPackSelected(listPacking[0])
      }
    }, [listPacking])

    _handleDecreasequantity = () => {
      if (amout > 1) {
        setAmout(amout - 1)
      }
    }

    _handleIncreasequantity = () => {
      setAmout(amout + 1)
    }

    _inputquantity = value => {
      if (parseInt(value) > 0) {
        setAmout(parseInt(value))
      } else setAmout(amout)
    }

    _handleAction = () => {
      let params = {
        product_id: data?.id,
        name: isTag ? data?.title : data?.name,
        product_image: isTag ? data?.img_url : data?.images[0]?.src,
        quantity: amout,
        check: false,
      }
      packSelected?.id ? (params['variation_id'] = packSelected?.id) : null
      packSelected?.name
        ? (params['variation_name'] = packSelected?.name)
        : null
      if (isBuy) {
        // mua ngay
        handleAction ? handleAction(params, true) : null
      } else {
        // thêm vào giỏ hàng
        handleAction ? handleAction(params, false) : null
      }
    }

    const _renderProductPackItemInDialog = useCallback(
      ({item, index}) => (
        <ItemPack
          value={item}
          selected={packSelected}
          onClick={_handleClickPackItemInDialog}
        />
      ),
      [packSelected],
    )

    _handleClickPackItemInDialog = item => {
      setPackSelected(item)
    }

    return (
      <Modal
        style={styles.containerDialog}
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}>
        <View style={[styles.viewDialog]}>
          <TouchableOpacity
            onPress={closeDialog}
            style={styles.containerClose}
          />
          <View style={[styles.containerContent]}>
            <View style={styles.itemView}>
              <View
                style={{
                  padding: 0.5,
                  borderRadius: 2,
                  backgroundColor: Colors.gray_E0E0E0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode={'cover'}
                  style={{height: 50, width: 50, borderRadius: 2}}
                  source={{uri: isTag ? data?.img_url : data?.images[0]?.src}}
                />
              </View>
              <View style={styles.infoView}>
                <Text numberOfLines={1} style={styles.textName}>
                  {isTag ? data?.title : data?.name}
                </Text>
                {packSelected?.name && (
                  <View style={styles.packView}>
                    <Text style={styles.textPack}>
                      <AppText title={'weight'} /> {packSelected.name}
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={closeDialog}
                activeOpacity={0.5}
                style={styles.buttonClose}>
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../assests/images/ic_close_black.png')}
                />
              </TouchableOpacity>
            </View>
            {listPacking?.length > 0 && (
              <FlatList
                style={{marginTop: 16}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={listPacking}
                renderItem={_renderProductPackItemInDialog}
                keyExtractor={(e, i) => i.toString()}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 16,
              }}>
              <AppText style={{flex: 1}} title={'quantity'} />
              <View
                style={{
                  marginHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={_handleDecreasequantity}
                  activeOpacity={0.5}>
                  <Image
                    style={{height: 30, width: 30}}
                    source={require('../../assests/images/ic_decrease_amount.png')}
                  />
                </TouchableOpacity>
                <TextInput
                  value={amout.toString()}
                  keyboardType='numeric'
                  style={{
                    minWidth: 40,
                    textAlign: 'center',
                    paddingHorizontal: 4,
                  }}
                  onChangeText={_inputquantity}
                />
                <TouchableOpacity
                  onPress={_handleIncreasequantity}
                  activeOpacity={0.5}>
                  <Image
                    style={{height: 30, width: 30}}
                    source={require('../../assests/images/ic_increase_amount.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={_handleAction}
              activeOpacity={0.5}
              style={styles.buttonAction}>
              <AppText
                style={styles.textAction}
                title={isBuy ? 'buy-now' : 'add-to-cart'}
              />
            </TouchableOpacity>
          </View>
        </View>
        {Platform.OS === 'ios' && (
          <KeyboardAvoidingView
            behavior={'padding'}
            keyboardVerticalOffset={0}
          />
        )}
      </Modal>
    )
  },
)

const styles = StyleSheet.create({
  containerDialog: {
    flex: 1,
  },
  viewDialog: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  containerClose: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  containerContent: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    padding: 16,
  },
  itemView: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray_E0E0E0,
  },
  infoView: {
    flex: 1,
    marginStart: 14,
    justifyContent: 'space-around',
  },
  buttonClose: {
    top: -8,
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packView: {
    padding: 3,
    backgroundColor: Colors.gray_F2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  textPack: {
    color: Colors.gray_828282,
    fontSize: FontSizes.size14,
  },
  textName: {
    fontSize: FontSizes.size16,
    fontWeight: '700',
    color: Colors.black_22281F,
  },
  textPrice: {
    fontSize: FontSizes.size14,
    color: Colors.gray_828282,
    marginVertical: 4,
  },
  buttonAction: {
    height: 40,
    backgroundColor: Colors.green_00A74C,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  textAction: {
    color: Colors.white,
    fontSize: FontSizes.size14,
    fontWeight: '700',
  },
})
