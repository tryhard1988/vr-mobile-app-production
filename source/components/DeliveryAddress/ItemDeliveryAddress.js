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
import AppText from '../SwitchLanguage/AppText'

export default ItemDeliveryAddress = ({data, onClickEdit}) => {
  _onClickEdit = () => {
    onClickEdit ? onClickEdit() : null
  }

  return (
    <View>
      <View
        style={{padding: 12, backgroundColor: Colors.white, marginVertical: 8}}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{color: Colors.black_22281F, fontWeight: '700', flex: 1}}>
            {data?.last_name &&
              data?.last_name &&
              `${data?.last_name} ${data?.first_name}`.trim()}
          </Text>
          <TouchableOpacity
            onPress={_onClickEdit}
            style={{paddingHorizontal: 4}}>
            <AppText style={{color: Colors.orange_F68B1F}} title={'Edit'} />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: Colors.gray_828282,
            fontSize: FontSizes.size12,
            marginVertical: 4,
          }}>
          {data?.phone}
        </Text>
        <Text style={{color: Colors.gray_828282, fontSize: FontSizes.size12}}>
          {data?.address_1}
        </Text>
      </View>
    </View>
  )
}
