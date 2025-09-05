import moment from 'moment';
import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import Colors from '../../styles/Colors';
import FontSizes from '../../styles/FontSizes';
import HTML from "react-native-render-html"

export default ItemPost = ({ index, value, onClickItem, itemStyle, imageStyle, isDate = false, isTag = false }) => {

    _handleClick = () => {
        if (onClickItem) {
            onClickItem(value, index)
        }
    }

    return isTag ? (
        <TouchableOpacity style={itemStyle} activeOpacity={0.5} onPress={_handleClick}>
            <Image
                resizeMode='cover'
                style={imageStyle}
                source={value?.img_url && { uri: value.img_url || null }}
            />
            <View style={{ flex: 1, height: 45, marginVertical: 2, padding: 5, }}>
                <HTML
                    html={`<p>${value?.title}</p>`}
                    baseFontStyle={styles.textDishName}
                    renderers={{
                        p: (_, children) => <Text numberOfLines={2}>{children}</Text>,
                    }}
                />
            </View>
            {isDate && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, marginBottom: 8 }}>
                    <Image
                        style={{ height: 16, width: 16 }}
                        source={require('../../assests/images/ic_calendar_gray.png')}
                    />
                    <Text style={styles.textDate}>{value?.date && moment(value.date, 'YYYY-MM-DD').format('DD-MM-YYYY')}</Text>
                </View>
            )}
        </TouchableOpacity>
    ) : (
        <TouchableOpacity style={itemStyle} activeOpacity={0.5} onPress={_handleClick}>
            <Image
                resizeMode='cover'
                style={imageStyle}
                source={(value?._embedded || {})['wp:featuredmedia']?.length > 0 && { uri: value?._embedded['wp:featuredmedia'][0]?.source_url || null }}
            />
            <View style={{ flex: 1, height: 45, marginVertical: 2, padding: 5, }}>
                <HTML
                    html={`<p>${value?.title?.rendered}</p>`}
                    baseFontStyle={styles.textDishName}
                    renderers={{
                        p: (_, children) => <Text numberOfLines={2}>{children}</Text>,
                    }}
                />
            </View>
            {isDate && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, marginBottom: 8 }}>
                    <Image
                        style={{ height: 16, width: 16 }}
                        source={require('../../assests/images/ic_calendar_gray.png')}
                    />
                    <Text style={styles.textDate}>{value?.date && moment(value.date, 'YYYY-MM-DD').format('DD-MM-YYYY')}</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    textDishName: {
        fontSize: FontSizes.size14,
        color: Colors.black_22281F
    },
    textDate: {
        flex: 1,
        marginStart: 5,
        fontSize: FontSizes.size12,
        color: Colors.gray_828282
    },
    textPack: {
        marginVertical: 3,
        width: 125,
        fontSize: FontSizes.size12,
        fontWeight: 'normal',
        color: Colors.gray_828282
    },
    textPrice: {
        fontSize: FontSizes.size16,
        fontWeight: '700',
        color: Colors.orange_F68B1F
    }
});