import React, {useState, useEffect} from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import InputView from '../Other/InputView'
import Colors from '../../styles/Colors'
import AppText from '../SwitchLanguage/AppText'
export default VoucherInput = ({onClickUse, containerStyle}) => {
  const [voucherCode, setVoucherCode] = useState(null)

  useEffect(() => {}, [])

  _handleChangeText = value => {
    setVoucherCode(value)
  }

  _onClickUse = () => {
    if (onClickUse) {
      onClickUse(voucherCode)
    }
  }

  return (
    <View
      style={[
        {
          backgroundColor: Colors.white,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 4,
          marginBottom: 8,
        },
        containerStyle,
      ]}>
      <AppText
        style={{color: Colors.gray_4F4F4F, fontWeight: '700'}}
        title={'apply-coupon'}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <InputView
          title='input-voucher'
          onChangeText={_handleChangeText}
          value={voucherCode}
          containerStyle={{flex: 1, marginEnd: 12}}
        />
        <TouchableOpacity
          onPress={_onClickUse}
          activeOpacity={0.5}
          style={{
            backgroundColor: Colors.gray_828282,
            height: 40,
            borderRadius: 6,
            justifyContent: 'center',
          }}>
          <AppText
            style={{color: Colors.white, paddingHorizontal: 15}}
            title={'apply'}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}
