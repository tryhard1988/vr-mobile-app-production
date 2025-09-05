import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native'
import Colors from '../../styles/Colors'

const {width, height} = Dimensions.get('screen')

export default SearchableDialogPicker = ({
  dataSource,
  placeHolderLabel,
  selectedLabel,
  isCompulsory,
  searchBarPlaceHolder,
  inputSearchStyle,
  selectedValue,
  title,
  titleStyle,
  scrollStyle,
}) => {
  const [isDialog, setDialog] = useState(false)
  const [data, setData] = useState([])
  const [selectedFlag, setSelectedFlag] = useState(false)

  useEffect(() => {
    dataSource && isDialog && setData(dataSource)
  }, [dataSource, isDialog])

  useEffect(() => {
    setSelectedFlag(selectedLabel ? true : false)
  }, [selectedLabel])

  _searchFilterFunction = (searchText, data) => {
    let newData = []
    if (searchText) {
      newData = data.filter(
        item => item.name.toUpperCase().search(searchText.toUpperCase()) >= 0,
      )
      setData([...newData])
    } else {
      setData(dataSource)
    }
  }

  _handleClickItem = e => {
    setDialog(false)
    setSelectedFlag(true)
    selectedValue && selectedValue(e)
  }

  _handleOpenDialog = () => {
    setDialog(true)
  }

  _onCloseDialog = () => {
    setDialog(false)
  }

  _renderItemListValues = (item, index) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.containerItemSearchable}
        onPress={() => _handleClickItem(item)}>
        <Text style={[styles.text, styles.textItem]}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  _renderEmptyItem = () => {
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          height: 100,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            alignSelf: 'center',
            marginBottom: 10,
            color: Colors.gray_4F4F4F,
          }}>
          Không có dữ liệu
        </Text>
      </View>
    )
  }

  return (
    <View>
      <Text style={[styles.textTitle, titleStyle]}>
        {title}
        {isCompulsory && <Text style={{color: Colors.red_DE3F4E}}> *</Text>}
      </Text>
      <TouchableOpacity style={[styles.container]} onPress={_handleOpenDialog}>
        {selectedFlag ? (
          <Text numberOfLines={1} style={[styles.textItem]}>
            {selectedLabel}
          </Text>
        ) : (
          <Text
            numberOfLines={1}
            style={[styles.textItem, {color: Colors.gray_BDBDBD}]}>
            {placeHolderLabel}
          </Text>
        )}
        <Image
          style={[styles.icon]}
          resizeMode='contain'
          source={require('../../assests/images/ic_arrow_down_gray.png')}
        />
      </TouchableOpacity>
      <Modal
        animationType='fade'
        transparent={true}
        visible={isDialog}
        style={styles.modalStyle}>
        <TouchableOpacity
          style={[styles.containerViewDialog]}
          onPress={_onCloseDialog}>
          <View
            style={{
              backgroundColor: Colors.green_00A74C,
              width: '80%',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{color: Colors.white, fontWeight: '700', flex: 1}}>
              {title}
            </Text>
            <Image
              style={{height: 24, width: 24}}
              source={require('../../assests/images/ic_close_white.png')}
            />
          </View>
          <TextInput
            onChangeText={text => _searchFilterFunction(text, dataSource)}
            placeholder={searchBarPlaceHolder}
            style={[styles.inputSearch, inputSearchStyle]}
            placeholderTextColor={Colors.gray9E}
            underlineColorAndroid='transparent'
            keyboardType='default'
            returnKeyType={'done'}
            blurOnSubmit={true}
          />
          <FlatList
            style={[styles.scroll, scrollStyle]}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            extraData={item => item.id}
            overScrollMode='never'
            keyboardShouldPersistTaps='always'
            numColumns={1}
            data={data}
            renderItem={({item, index}) => _renderItemListValues(item, index)}
            ListEmptyComponent={_renderEmptyItem}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    backgroundColor: Colors.white,
    borderColor: Colors.gray_BDBDBD,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginVertical: 8,
  },
  textTitle: {
    color: Colors.gray_4F4F4F,
    marginTop: 8,
  },
  textItem: {
    flex: 1,
    color: Colors.black_22281F,
    fontSize: 14,
  },
  icon: {
    marginHorizontal: 10,
    height: 16,
    width: 16,
  },
  containerItemSearchable: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  modalStyle: {
    flex: 1,
  },
  containerViewDialog: {
    width: width,
    height: height,
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    width: '80%',
    maxHeight: height * 0.4,
    backgroundColor: Colors.white,
    marginBottom: 60,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  inputSearch: {
    width: '80%',
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomColor: Colors.gray_F2,
    borderBottomWidth: 0.5,
  },
})
