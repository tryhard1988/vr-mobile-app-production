import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Switch,
  Alert,
  FlatList,
} from 'react-native';
import Colors from '../../styles/Colors';
import FontSizes from '../../styles/FontSizes';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../../components/Other/InputView';
import ToolbarNormal from '../../components/Other/ToolbarNormal';
import SearchableDialogPicker from '../../components/Picker/SearchableDialogPicker';
import {checkValidatePhone, convertStringToPrice} from '../../helpers/Utils';
import ItemDeliveryAddress from '../../components/DeliveryAddress/ItemDeliveryAddress';
import {useCallback} from 'react';
import moment from 'moment';
import AppText from '../../components/SwitchLanguage/AppText';

export default OrderHistoryDetailScreen = ({navigation, route}) => {
  const [orderData, setOrderData] = useState(null);

  const cartState = useSelector((state) => state.cart);

  useEffect(() => {
    if (route?.params?.item) {
      let data = JSON.parse(JSON.stringify(route?.params?.item));
      let customData = [];
      data?.line_items.length > 0 &&
        data.line_items.forEach((item) => {
          delete item?.id;
          delete item?.parent_name;
          // if (item?.variation_id == 0) {
          //     delete item.variation_id
          // }
          item?.meta_data.forEach((e) => {
            if (e?.key == 'pa_khoi-luong') {
              item['variation_name'] = e?.value;
            }
          });
        });
      setOrderData(data);
    }
  }, [route?.params?.item]);

  _handleBack = () => {
    navigation.pop();
  };

  const _renderOrderProductItem = useCallback(
    ({item, index}) => (
      <TouchableOpacity
        onPress={() => _onClickProductItem(item)}
        activeOpacity={1}
        style={styles.containerOrderProductItem}>
        <View style={{paddingStart: 12, flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{color: Colors.gray_4F4F4F, fontWeight: '700', flex: 1}}>
              {item?.name}
            </Text>
            <Text
              style={{color: Colors.gray_828282, fontSize: FontSizes.size14}}>
              x{item?.quantity}
            </Text>
          </View>
          {item?.meta_data.length > 0 && (
            <View style={styles.packView}>
              <Text style={styles.textPack}>
                <AppText title={'weight'} /> {item?.variation_name}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    ),
    [orderData],
  );

  _onClickProductItem = (data) => {
    navigation.push('ProductDetail', {item: data?.product_id, isGetData: true});
  };

  _renderStatusText = (data) => {
    let content = {};
    switch (data) {
      case 'pending': {
        content = {text: 'pending', color: Colors.gray_4F4F4F};
        break;
      }
      case 'processing': {
        content = {text: 'processing', color: '#64bd8c'};
        break;
      }
      case 'on-hold': {
        content = {text: 'on-hold', color: Colors.orange_F68B1F};
        break;
      }
      case 'completed': {
        content = {text: 'completed', color: '#00bdc7'};
        break;
      }
      case 'cancelled': {
        content = {text: 'cancelled', color: '#fa6472'};
        break;
      }
      case 'refunded': {
        content = {text: 'refunded', color: Colors.gray_4F4F4F};
        break;
      }
      case 'failed': {
        content = {text: 'failed', color: '#fa6472'};
        break;
      }
      default: {
        content = {text: 'N/A', color: Colors.gray_4F4F4F};
        break;
      }
    }
    return (
      <AppText
        style={[styles.textContent, {fontWeight: '700', color: content?.color}]}
        title={content?.text}
      />
    );
  };

  _renderHeader = useCallback(
    ({item, index}) => (
      <View>
        <View style={styles.lineContent}>
          <Text style={styles.textTitle}>
            <AppText title={'order-status'} />:{' '}
            {_renderStatusText(orderData?.status)}
          </Text>
          <Text style={styles.textTitle}>
            <AppText title={'o-date'} />:{' '}
            <Text style={styles.textContent}>
              {orderData?.date_created
                ? moment(orderData.date_created, 'YYYY-MM-DDTHH:mm').format(
                    'DD-MM-YYYY HH:mm',
                  )
                : 'N/A'}
            </Text>
          </Text>
          <Text style={styles.textTitle}>
            <AppText title={'o-payment-method'} />:{' '}
            <AppText
              style={styles.textContent}
              title={orderData?.payment_method}
            />
          </Text>
        </View>
        <View style={styles.lineContent}>
          <AppText
            style={[styles.textHighlight, {marginBottom: 4}]}
            title={'deli-info'}
          />
          <Text style={styles.textContent}>
            {orderData?.billing?.last_name} {orderData?.billing?.first_name}
          </Text>
          <Text style={styles.textAddress}>
            {orderData?.billing?.phone || 'N/A'}
          </Text>
          <Text style={styles.textAddress}>
            {orderData?.billing?.address_1}
          </Text>
        </View>
        <View style={[styles.lineContent, {paddingBottom: 4}]}>
          <AppText style={styles.textHighlight} title={'order-info'} />
        </View>
      </View>
    ),
    [orderData],
  );
  _renderFooter = () => (
    <View
      style={{
        paddingVertical: 5,
        backgroundColor: Colors.white,
        marginBottom: 16,
      }}
    />
  );

  _handleReOrder = () => {
    cartState.productsCart = orderData?.line_items;
    navigation.push('Cart');
  };

  return (
    <View style={styles.container}>
      <ToolbarNormal
        titleToolbar={'o-order'}
        onClose={_handleBack}
        child={` #${orderData?.id || 'N/A'}`}
      />

      <FlatList
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        data={orderData?.line_items}
        renderItem={_renderOrderProductItem}
        keyExtractor={(e, i) => i.toString()}
        extraData={(e, i) => i.toString()}
        ListHeaderComponent={_renderHeader}
        ListFooterComponent={_renderFooter}
      />
      <View style={{paddingVertical: 12, backgroundColor: Colors.white}}>
        <TouchableOpacity
          onPress={_handleReOrder}
          activeOpacity={0.5}
          style={[styles.buttonBuy]}>
          <AppText
            style={{paddingHorizontal: 16, color: Colors.white}}
            title={'repurchase'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  lineContent: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  textHighlight: {
    paddingVertical: 2,
    color: Colors.gray_4F4F4F,
    fontWeight: '700',
  },
  textTitle: {
    paddingVertical: 2,
    color: Colors.gray_828282,
  },
  textContent: {
    paddingVertical: 2,
    color: Colors.gray_4F4F4F,
  },
  textAddress: {
    paddingVertical: 2,
    fontSize: 12,
    color: Colors.gray_828282,
  },
  containerOrderProductItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  viewImage: {
    padding: 1,
    backgroundColor: Colors.gray_F2,
    shadowColor: Colors.gray_BDBDBD,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 1,
  },
  packView: {
    marginTop: 4,
    padding: 3,
    backgroundColor: Colors.gray_F2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  textPack: {
    color: Colors.gray_828282,
    fontSize: FontSizes.size12,
  },
  buttonBuy: {
    marginHorizontal: 16,
    height: 40,
    backgroundColor: Colors.green_00A74C,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
});
