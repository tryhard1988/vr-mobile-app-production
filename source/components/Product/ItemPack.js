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

export default ItemPack = ({ value, onClick, selected }) => {


    _handleClick = () => {
        if (onClick) {
            onClick(value)
        }
    }

    return (
        <TouchableOpacity activeOpacity={0.5} onPress={_handleClick} style={[styles.containerPackItemNormal, selected?.id == value.id && styles.containerPackItemSelected]}>
            <Text style={[styles.textPackNormal, selected?.id == value.id && styles.textPackSelected]}>{value.name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerPackItemNormal: {
        width: 75,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 10,
        borderRadius: 6,
        borderColor: Colors.orange_F68B1F,
        borderWidth: 1
    },
    containerPackItemSelected: {
        backgroundColor: Colors.orange_F68B1F
    },
    textPackNormal: {
        fontSize: FontSizes.size14,
        color: Colors.orange_F68B1F,

    },
    textPackSelected: {
        color: Colors.white,
    }
});