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
} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import {useDispatch, useSelector} from 'react-redux'
import Input from '../../components/Other/InputView'
import ErrorTitle from '../../components/Other/ErrorLabel'
import ToolbarNormal from '../../components/Other/ToolbarNormal'
import SearchableDialogPicker from '../../components/Picker/SearchableDialogPicker'
import {checkValidatePhone} from '../../helpers/Utils'
import ItemDeliveryAddress from '../../components/DeliveryAddress/ItemDeliveryAddress'
import {useCallback} from 'react'
import AppText from '../../components/SwitchLanguage/AppText'

export default DeliveryAddressScreen = ({navigation}) => {
  const userState = useSelector(state => state.user)

  const [data, setData] = useState(null)

  useEffect(() => {
    if (
      userState.userInfo?.billing?.first_name != '' &&
      userState.userInfo?.billing?.address_1 != '' &&
      userState.userInfo?.billing?.phone != ''
    ) {
      setData(userState.userInfo?.billing)
    } else setData(null)
  }, [userState.userInfo])

  _handleBack = () => {
    navigation.pop()
  }

  _onClickAddAddress = () => {
    navigation.push('InputDeliveryAddress')
  }

  _onClickEditAddress = () => {
    navigation.push('InputDeliveryAddress')
  }

  return (
    <View style={styles.container}>
      <ToolbarNormal titleToolbar='delivery-addr' onClose={_handleBack} />
      <View style={{flex: 1}}>
        {data ? (
          <ItemDeliveryAddress data={data} onClickEdit={_onClickEditAddress} />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 50,
            }}>
            <AppText
              style={{color: Colors.gray_4F4F4F}}
              title={'no-deli-addr'}
            />
          </View>
        )}
      </View>
      {!data && (
        <TouchableOpacity
          onPress={_onClickAddAddress}
          activeOpacity={0.5}
          style={styles.viewButtonAdd}>
          <AppText title={'add-new-addr'} />
        </TouchableOpacity>
      )}
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
    marginVertical: 16,
  },
})
