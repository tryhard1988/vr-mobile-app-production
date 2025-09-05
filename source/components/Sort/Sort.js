import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider
} from 'react-native-popup-menu'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'

export default SortDate = ({ iconSort, styleIcon, onPress, dataSort, select }) => {

    const [sortIS, setSortIS] = useState(select)

    useEffect(() => {
        setSortIS(select)
    }, [select])

    _handlePress = (item) => {
        setSortIS(item.id)
        if (onPress) {
            onPress(item.id)
        }
    }

    _renderOptions = () => {
        let listOps = []
        dataSort.forEach((e, i) => {
            listOps.push(
                <MenuOption key={e.id} style={{ padding: 5 }} onSelect={() => { _handlePress(e) }}>
                    <View style={[styles.containerOptions, sortIS == e.id ? styles.containerOptionsSelect : styles.containerOptionsUnSelect]}>
                        <Text style={[styles.textItemTitle, sortIS == e.id ? styles.textItemTitleSelect : styles.textItemTitleUnselect]}>{e.name}</Text>
                    </View>
                </MenuOption>
            )
        })
        return listOps
    }

    return (
        <Menu>
            <MenuTrigger style={styles.containerButton}>
                <Image
                    style={[styles.iconSort, styleIcon]}
                    resizeMode='contain'
                    source={iconSort}
                />
            </MenuTrigger>
            <MenuOptions>
                {_renderOptions()}
            </MenuOptions>
        </Menu>
    )
}

const styles = StyleSheet.create({
    containerOptions: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 36,
        borderRadius: 4,
        paddingHorizontal: 8
    },
    containerOptionsSelect: {
        backgroundColor: Colors.green_00A74C
    },
    containerOptionsUnSelect: {
        backgroundColor: Colors.white
    },
    textItemTitle: {
        fontSize: FontSizes.size14,
    },
    textItemTitleSelect: {
        fontWeight: '700',
        color: Colors.white,
    },
    textItemTitleUnselect: {
        color: Colors.black_22281F,
    },
    containerButton: {
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    iconSort: {
        width: 32,
        height: 32
    }
});