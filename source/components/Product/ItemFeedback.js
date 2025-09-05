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
import Stars from 'react-native-stars'
import moment from 'moment'

export default ItemFeedback = ({data, hasAvatar = true}) => {
  _handleRatingData = value => {}

  return (
    <View style={[styles.containerItem]}>
      {hasAvatar && (
        <Image
          source={require('../../assests/images/img_empty_avatar.png')}
          resizeMode='contain'
          style={{height: 35, width: 35, borderRadius: 18, marginEnd: 10}}
        />
      )}
      <View style={{flex: 1}}>
        <Text style={styles.textName}>{data?.name}</Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 2,
          }}>
          <Stars
            display={data?.rating}
            spacing={2}
            count={5}
            starSize={14}
            fullStar={require('../../assests/images/ic_full_star.png')}
            emptyStar={require('../../assests/images/ic_empty_star.png')}
          />
          <Text style={styles.textDate}>
            {moment(data?.date_created).format('DD/MM/YYYY - HH:mm')}
          </Text>
        </View>
        <Text>{data?.review}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerItem: {
    padding: 8,
    borderColor: Colors.gray_F2,
    borderTopWidth: 0.5,
    flexDirection: 'row',
  },
  textName: {
    fontSize: FontSizes.size14,
    color: Colors.black_22281F,
    fontWeight: '700',
  },
  textDate: {
    fontSize: FontSizes.size12,
    color: Colors.gray_828282,
  },
})
