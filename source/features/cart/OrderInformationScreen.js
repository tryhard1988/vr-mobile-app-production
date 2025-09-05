import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import VoucherInput from '../../components/Input/VoucherInput';
import InputView from '../../components/Other/InputView';
import ToolbarNormal from '../../components/Other/ToolbarNormal';
import {convertStringToPrice} from '../../helpers/Utils';
import {handleLoading} from '../../store/actions/UtilsActions';
import Colors from '../../styles/Colors';
import FontSizes from '../../styles/FontSizes';
import {
  getPaymentMethod,
  submitCreateOrder,
} from '../../store/actions/OrderActions';
import {saveCart} from '../../helpers/Storages';
import AppText from '../../components/SwitchLanguage/AppText';
import I18n from '../../config/LanguageConfig';
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';

export default OrderSuccessScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const orderState = useSelector((state) => state.order);
  const userState = useSelector((state) => state.user);
  const lang = useSelector((state) => state.lang.language);

  const [orderData, setOrderData] = useState();
  const [payment, setPayment] = useState(null);
  const [note, setNote] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // if (orderState.paymentMethod.length == 0) {
    dispatch(getPaymentMethod());
    // }
  }, []);

  useEffect(() => {
    if (orderState.paymentMethod.length > 0) {
      setPayment({
        id: orderState.paymentMethod[0]?.id,
        title: orderState.paymentMethod[0]?.title,
      });
    }
  }, [orderState.paymentMethod]);

  useEffect(() => {
    if (route?.params?.data) {
      setOrderData(route?.params?.data);
    }
    // if (userState.userInfo?.billing?.first_name != '' && userState.userInfo?.billing?.last_name != ''
    //     && userState.userInfo?.billing?.address_1 != '' && userState.userInfo?.billing?.phone != '') {
    //     setHasAddress(true)
    // }
  }, [route?.params?.data]);

  useEffect(() => {
    if (userState.userInfo) {
      setIsLogin(true);
      if (
        userState.userInfo?.billing?.first_name != '' &&
        userState.userInfo?.billing?.last_name != '' &&
        userState.userInfo?.billing?.address_1 != '' &&
        userState.userInfo?.billing?.phone != ''
      ) {
        setHasAddress(true);
      } else {
        setHasAddress(false);
      }
    } else {
      setIsLogin(false);
    }
  }, [userState.userInfo]);

  _handleBack = () => {
    isSuccess ? _handleContinueShopping() : navigation.pop();
  };

  const _renderOrderProductItem = useCallback(
    ({item, index}) => (
      <View style={styles.containerOrderProductItem}>
        <View style={styles.viewImage}>
          <Image
            resizeMode="cover"
            style={{height: 60, width: 60}}
            source={{uri: item?.product_image}}
          />
        </View>
        <View style={{paddingStart: 10, flex: 1}}>
          <Text
            style={{
              color: Colors.gray_4F4F4F,
              fontWeight: '700',
              marginBottom: 4,
            }}>
            {item?.name}
          </Text>
          {/* <Text style={{ color: Colors.gray_828282, fontSize: FontSizes.size12, marginBottom: 2 }}>{convertStringToPrice(item?.price)}đ</Text> */}
          <Text style={{color: Colors.gray_828282, fontSize: FontSizes.size12}}>
            x{item?.quantity}
          </Text>
          {item?.variation_name && (
            <View style={styles.packView}>
              <Text style={styles.textPack}>
                <AppText title={'weight'} /> {item?.variation_name}
              </Text>
            </View>
          )}
        </View>
      </View>
    ),
    [orderData],
  );

  _onChangeDeliveryAddress = () => {
    navigation.push('DeliveryAddress');
  };

  _onAddDeliveryAddress = () => {
    navigation.push('DeliveryAddress');
  };

  _onLoginNow = () => {
    navigation.push('Auth', {screen: 'Login'});
  };

  _renderPaymentItem = useCallback(
    ({item, index}) => (
      <TouchableOpacity
        onPress={() =>
          setPayment({
            id: item?.id,
            title: lang === 'vi' ? item?.title : item?.description,
          })
        }
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 4,
          alignItems: 'center',
        }}>
        <Text
          style={
            payment?.id == item?.id
              ? styles.paymentChecked
              : styles.paymentUncheck
          }>
          » {lang === 'vi' ? item?.title : item?.description}
        </Text>
        <Image
          style={{height: 28, width: 28}}
          source={
            payment?.id == item?.id
              ? require('../../assests/images/ic_radio_button_checked.png')
              : require('../../assests/images/ic_radio_button_uncheck.png')
          }
        />
      </TouchableOpacity>
    ),
    [payment],
  );

  _renderHeader = useCallback(
    () => (
      <View>
        {hasAddress && isLogin ? (
          <TouchableOpacity
            onPress={_onChangeDeliveryAddress}
            activeOpacity={0.5}
            style={styles.viewLine}>
            <Image
              resizeMode="cover"
              style={{height: 22, width: 22}}
              source={require('../../assests/images/ic_location.png')}
            />
            <View style={styles.contentAddress}>
              <Text style={{color: Colors.black_22281F, fontWeight: '700'}}>
                {userState.userInfo?.billing?.last_name}{' '}
                {userState.userInfo?.billing?.first_name}
              </Text>
              <Text
                style={{
                  color: Colors.gray_828282,
                  fontSize: FontSizes.size12,
                  marginVertical: 4,
                }}>
                {userState.userInfo?.billing?.phone}
              </Text>
              <Text
                style={{color: Colors.gray_828282, fontSize: FontSizes.size12}}>
                {userState.userInfo?.billing?.address_1}
              </Text>
            </View>
            <Image
              resizeMode="cover"
              style={{height: 22, width: 22}}
              source={require('../../assests/images/ic_arrow_right.png')}
            />
          </TouchableOpacity>
        ) : isLogin && !hasAddress ? (
          <TouchableOpacity
            onPress={_onAddDeliveryAddress}
            activeOpacity={0.5}
            style={styles.viewLine}>
            <Image
              resizeMode="cover"
              style={{height: 22, width: 22}}
              source={require('../../assests/images/ic_location.png')}
            />
            <View style={styles.contentAddress}>
              <AppText
                style={{color: Colors.black_22281F, fontWeight: '700'}}
                title={'dont-have-delivery-addr'}
              />
              <AppText
                style={{
                  color: Colors.green_00A74C,
                  fontSize: FontSizes.size12,
                  marginVertical: 4,
                }}
                title={'add-delivery-addr'}
              />
            </View>
            <Image
              resizeMode="cover"
              style={{height: 22, width: 22}}
              source={require('../../assests/images/ic_arrow_right.png')}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={_onLoginNow}
            activeOpacity={0.5}
            style={styles.viewLine}>
            <Image
              resizeMode="cover"
              style={{height: 22, width: 22}}
              source={require('../../assests/images/ic_location.png')}
            />
            <View style={styles.contentAddress}>
              <AppText
                style={{color: Colors.black_22281F, fontWeight: '700'}}
                title={'not-login-yet'}
              />
              <AppText
                style={{
                  color: Colors.green_00A74C,
                  fontSize: FontSizes.size12,
                  marginVertical: 4,
                }}
                title={'login-now'}
              />
            </View>
            <Image
              resizeMode="cover"
              style={{height: 22, width: 22}}
              source={require('../../assests/images/ic_arrow_right.png')}
            />
          </TouchableOpacity>
        )}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 12,
            backgroundColor: Colors.white,
          }}>
          <AppText
            style={{color: Colors.gray_4F4F4F, fontWeight: '700'}}
            title={'order-info'}
          />
        </View>
      </View>
    ),
    [hasAddress, isLogin, userState.userInfo],
  );

  _renderFooter = useCallback(
    () => (
      <View
        style={{
          paddingVertical: 8,
          backgroundColor: Colors.white,
          marginVertical: 8,
        }}>
        <AppText
          style={{
            color: Colors.gray_4F4F4F,
            fontWeight: '700',
            marginVertical: 4,
            marginHorizontal: 16,
          }}
          title={'payment-method'}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orderState.paymentMethod}
          renderItem={_renderPaymentItem}
          keyExtractor={(e, i) => i.toString()}
          extraData={(e, i) => i.toString()}
        />
      </View>
    ),
    [payment],
  );

  _inputNote = (text) => {
    setNote(text);
  };

  _handleSubmitOrder = () => {
    if (isLogin) {
      if (hasAddress) {
        let params = {
          customer_id: userState.userInfo?.id,
          status: 'processing',
          billing: userState.userInfo?.billing,
          shipping: userState.userInfo?.billing,
          line_items: orderData?.orderProducts,
          payment_method: payment?.id,
          payment_method_title: payment?.title,
        };
        note != '' ? (params['customer_note'] = note) : null;
        payment
          ? dispatch(submitCreateOrder(params, _submitOrderSuccess))
          : Alert.alert(null, I18n.t('pls-input-order-methor'), [
              {text: I18n.t('0k'), onPress: () => {}, style: 'default'},
            ]);
      } else {
        Alert.alert(null, I18n.t('pls-input-delivery-addr'), [
          {text: I18n.t('0k'), onPress: () => {}, style: 'default'},
        ]);
      }
    } else {
      Alert.alert(null, I18n.t('should-login-to-buy'), [
        {text: I18n.t('no'), onPress: () => {}, style: 'default'},
        {
          text: I18n.t('ok'),
          onPress: () => {
            _onLoginNow();
          },
          style: 'destructive',
        },
      ]);
    }
  };

  _submitOrderSuccess = () => {
    setIsSuccess(true);
    let cartUpdate = cartState.productsCart.filter(
      (item) => !orderData?.orderProducts.includes(item),
    );
    saveCart(cartUpdate);
    cartState.productsCart = cartUpdate;
  };

  _handleContinueShopping = () => {
    navigation.navigate('Main', {screen: 'Products'});
  };

  return isSuccess ? (
    <View style={styles.container}>
      <ToolbarNormal titleToolbar={'order-success'} onClose={_handleBack} />
      <View style={styles.emptyView}>
        <Image
          style={{height: 120, width: 139, margin: '5%'}}
          resizeMode={'contain'}
          source={require('../../assests/images/ic_order_success.png')}
        />
        <AppText style={styles.textEmpty} title={'order-success-element'} />
        <TouchableOpacity
          onPress={_handleContinueShopping}
          style={styles.buttonBackHome}>
          <AppText style={styles.textBackHome} title={'continue-shopping'} />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <ToolbarNormal
        titleToolbar={'order-info-toolbar'}
        onClose={_handleBack}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: 64}}>
        <FlatList
          style={{backgroundColor: Colors.gray_F2}}
          showsVerticalScrollIndicator={false}
          data={orderData?.orderProducts}
          renderItem={_renderOrderProductItem}
          keyExtractor={(e, i) => i.toString()}
          extraData={(e, i) => i.toString()}
          ListHeaderComponent={_renderHeader}
          ListFooterComponent={_renderFooter}
        />
        {/** ghi chú đặt hàng */}
        <View
          style={{
            paddingTop: 8,
            paddingBottom: 4,
            backgroundColor: Colors.white,
            paddingHorizontal: 16,
          }}>
          <AppText
            style={{color: Colors.gray_4F4F4F, fontWeight: '700'}}
            title={'order-note'}
          />
          <InputView
            title="input-order-note"
            isMultiline
            inputStyle={{
              height: 60,
              textAlignVertical: 'top',
              paddingVertical: 5,
            }}
            onChangeText={_inputNote}
            value={note}
          />
        </View>
        <View style={{height: 150}} />
      </KeyboardAwareScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: Colors.white,
          paddingHorizontal: 16,
          paddingVertical: 12,
          width: '100%',
        }}>
        <TouchableOpacity
          onPress={_handleSubmitOrder}
          activeOpacity={0.5}
          style={{
            height: 40,
            paddingHorizontal: 25,
            backgroundColor: Colors.green_00A74C,
            borderRadius: 6,
            justifyContent: 'center',
            flex: 1,
          }}>
          <AppText
            style={{color: Colors.white, textAlign: 'center'}}
            title={'order'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  viewLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 12,
    paddingEnd: 8,
    backgroundColor: Colors.white,
    marginVertical: 8,
  },
  contentAddress: {
    padding: 8,
    flex: 1,
  },
  packView: {
    marginTop: 2,
    padding: 3,
    backgroundColor: Colors.gray_F2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  textPack: {
    color: Colors.gray_828282,
    fontSize: FontSizes.size12,
  },
  containerOrderProductItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
  },
  viewImage: {
    padding: 1,
    backgroundColor: Colors.gray_E0E0E0,
    shadowColor: Colors.gray_BDBDBD,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 1,
  },
  paymentChecked: {
    flex: 1,
    marginStart: 10,
    color: Colors.green_00A74C,
  },
  paymentUncheck: {
    flex: 1,
    marginStart: 10,
    color: Colors.gray_4F4F4F,
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
});
