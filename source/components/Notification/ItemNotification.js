import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from 'react-native'
import Colors from '../../styles/Colors';
import FontSizes from '../../styles/FontSizes';

export default ItemNotification = ({ value, onClickItem, itemStyle, imageStyle, isDate = false }) => {

    const testData = [
        {
            name: 'Đậu phụ nhồi thịt sốt cà chua',
            date: '15-03-2021',
            photo: 'https://vcdn-ngoisao.vnecdn.net/2019/06/11/62521621-711172125964850-77614-9305-9337-1560248520.jpg',
        }, {
            name: 'Gà ôm nấm hương',
            date: '15-03-2021',
            photo: 'https://pastaxi-manager.onepas.vn/content/uploads/articles/cach-lam-ga-om-nam/cach-lam-ga-om-nam-6.jpg'
        }, {
            name: 'Canh gà lá giang',
            date: '13-03-2021',
            photo: 'http://media.doisongphapluat.com/2019/09/22/canh_ga_la_giang_dspl_4.jpg'
        }, {
            name: 'Canh rau củ ngũ sắc (món chay)',
            date: '10-03-2021',
            photo: 'https://hitachay.com/wp-content/uploads/2019/09/hita-chay-mon-canh-chay-ngon-de-nau-1.jpg'
        }, {
            name: 'Gỏi đu đủ tôm chua cay giòn ngọt',
            date: '05-03-2021',
            photo: 'https://danviet.mediacdn.vn/upload/1-2018/images/2018-03-07/_mg_9365-1520412860-width650height433.jpg'
        }
    ]
    value = testData[Math.floor(Math.random() * testData.length)]

    _handleClick = () => {
        if (onClickItem) {
            onClickItem()
        }
    }

    return (
        <View style={{ flexDirection: 'row', padding: 12, backgroundColor: Colors.white, marginTop: 8 }}>
            <Image
                resizeMode='cover'
                style={{ height: 22, width: 22 }}
                source={require('../../assests/images/ic_line_order_history.png')}
            />
            <View style={{ paddingStart: 12 }}>
                <Text style={{ color: Colors.black_22281F, fontWeight: '700' }}>Đã giao hàng thành công</Text>
                <Text style={{ color: Colors.gray_828282, paddingVertical: 4 }}>Đơn hàng #4856 đã được giao hàng thành công</Text>
                <Text style={{ color: Colors.gray_828282, fontSize: 12 }}>20:00 10-03-2021</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    textDishName: {
        flex: 1,
        height: 45,
        marginVertical: 2,
        padding: 5,
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