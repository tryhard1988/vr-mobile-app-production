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
import HTML from 'react-native-render-html'

export default ItemComment = ({data}) => {

  return (
    <View style={[styles.containerItem]}>
      <Image
        source={{uri: data?.author_avatar_urls['48']}}
        resizeMode='contain'
        style={{height: 35, width: 35, borderRadius: 18}}
      />
      <View style={{flex: 1, paddingLeft: 10}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textName}>{data?.author_name}</Text>
          <Text style={styles.textDate}>
            {moment(data?.date, 'YYYY-MM-DDTHH:mm').format(
              'DD/MM/YYYY - HH:mm',
            )}
          </Text>
        </View>
        <HTML
          source={{html: data?.content?.rendered}}
          baseFontStyle={styles.textContent}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerItem: {
    paddingHorizontal: 8,
    paddingTop: 8,
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
  textContent: {
    fontSize: FontSizes.size14,
    color: Colors.black_22281F,
  },
})
