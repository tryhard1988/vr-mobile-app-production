import React, {useEffect, useState, useRef} from 'react'
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
  ActivityIndicator,
} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import {useDispatch, useSelector} from 'react-redux'
import Input from '../../components/Other/InputView'
import ToolbarNormal from '../../components/Other/ToolbarNormal'
import SearchableDialogPicker from '../../components/Picker/SearchableDialogPicker'
import {checkValidatePhone, convertStringToPrice} from '../../helpers/Utils'
import ItemDeliveryAddress from '../../components/DeliveryAddress/ItemDeliveryAddress'
import {useCallback} from 'react'
import {getMoreMyOrders, getMyOrders} from '../../store/actions/OrderActions'
import moment from 'moment'
import AppText from '../../components/SwitchLanguage/AppText'

export default OrderHistoryScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)
  const orderState = useSelector(state => state.order)

  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    dispatch(getMyOrders(userState.userInfo?.id))
  }, [])

  useEffect(() => {
    if (orderState.myOrders.length > 0) {
      setLoadingMore(false)
    }
  }, [orderState.myOrders])

  _handleBack = () => {
    navigation.pop()
  }

  _onClickItemOrder = detail => {
    navigation.push('OrderHistoryDetail', {item: detail})
  }

  _handleLoadMore = () => {
    if (orderState.isMore) {
      setLoadingMore(true)
      dispatch(
        getMoreMyOrders(userState.userInfo?.id, orderState.pageIndex + 1),
      )
    }
  }

  const _renderFooter = useCallback(() => {
    if (!loadingMore)
      return orderState.myOrders.length > 0 ? (
        <View style={{height: 10}} />
      ) : (
        <AppText style={styles.textNull} title={'no-order'} />
      )
    return (
      <View style={{marginBottom: 15}}>
        <ActivityIndicator animating color={Colors.gray_4F4F4F} size='large' />
      </View>
    )
  }, [loadingMore, orderState.myOrders])

  _handleRefresh = () => {
    dispatch(getMyOrders(userState.userInfo?.id))
  }

  _renderStatus = data => {
    let content = {}
    switch (data) {
      case 'pending': {
        content = {text: 'pending', color: '#a1a1a1'}
        break
      }
      case 'processing': {
        content = {text: 'processing', color: '#64bd8c'}
        break
      }
      case 'on-hold': {
        content = {text: 'on-hold', color: Colors.orange_F68B1F}
        break
      }
      case 'completed': {
        content = {text: 'completed', color: '#00bdc7'}
        break
      }
      case 'cancelled': {
        content = {text: 'cancelled', color: '#fa6472'}
        break
      }
      case 'refunded': {
        content = {text: 'refunded', color: Colors.gray_828282}
        break
      }
      case 'failed': {
        content = {text: 'failed', color: '#fa6472'}
        break
      }
      default: {
        content = {text: 'N/A', color: '#a1a1a1'}
        break
      }
    }
    return (
      <View
        style={{
          alignSelf: 'center',
          height: 40,
          width: 80,
          backgroundColor: content?.color,
          borderRadius: 4,
          justifyContent: 'center',
        }}>
        <AppText
          style={{color: Colors.white, textAlign: 'center'}}
          title={content?.text}
        />
      </View>
    )
  }

  const _renderOrderItem = useCallback(
    ({item, index}) => (
      <TouchableOpacity
        onPress={() => _onClickItemOrder(item)}
        activeOpacity={1}
        style={styles.containerItem}>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 8,
            borderBottomColor: Colors.gray_E0E0E0,
            borderBottomWidth: 1,
          }}>
          <View style={{flex: 1}}>
            <Text style={[styles.textTitle, {marginBottom: 4}]}>
              <AppText title={'o-order'} />{' '}
              <Text style={[styles.textContent, {fontWeight: '700'}]}>
                #{item?.id}
              </Text>
            </Text>
            <Text style={styles.textTitle}>
              <AppText title={'o-date'} />{' '}
              <Text style={styles.textContent}>
                {item?.date_created
                  ? moment(item.date_created, 'YYYY-MM-DDTHH:mm').format(
                      'DD-MM-YYYY HH:mm',
                    )
                  : 'N/A'}
              </Text>
            </Text>
          </View>
          {_renderStatus(item?.status)}
        </View>
        <View style={{flexDirection: 'row', paddingTop: 8}}>
          <AppText style={[styles.textTitle, {flex: 1, textAlign: 'left'}]} title={item?.payment_method}/>
          <Text style={styles.textTitle}>
            {item?.line_items?.length} <AppText title={'product'} />
            {item?.line_items?.length === 1 ? '' : 's'}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [orderState.myOrders],
  )

  return (
    <View style={styles.container}>
      <ToolbarNormal titleToolbar='order-history' onClose={_handleBack} />
      <FlatList
        style={{flex: 1, paddingVertical: 8}}
        showsVerticalScrollIndicator={false}
        data={orderState.myOrders}
        renderItem={_renderOrderItem}
        keyExtractor={(e, i) => i.toString()}
        extraData={(e, i) => i.toString()}
        onEndReached={_handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={_renderFooter}
        onRefresh={_handleRefresh}
        refreshing={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  viewButtonAdd: {
    height: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.orange_F68B1F,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  containerItem: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  textTitle: {
    color: Colors.gray_828282,
  },
  textContent: {
    color: Colors.black_22281F,
  },
  textNull: {
    color: Colors.gray_828282,
    marginTop: 100,
    textAlign: 'center',
  },
})
