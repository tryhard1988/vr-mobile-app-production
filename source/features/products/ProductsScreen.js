import React, {useEffect, useState, useRef, useCallback} from 'react'
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import Colors from '../../styles/Colors'
import I18n from '../../config/LanguageConfig'
import FontSizes from '../../styles/FontSizes'
import ProductCategory from '../../components/Category/ProductCategory'
import ItemProduct from '../../components/Product/ItemProduct'
import {MenuProvider} from 'react-native-popup-menu'
import Sort from '../../components/Sort/Sort'
import {useIsFocused} from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {
  getListProduct,
  getMoreListProduct,
  getPackingVariation,
} from '../../store/actions/ProductsActions'
import SearchInput from '../../components/Input/SearchInput'
import {handleLoading, requestSuccess} from '../../store/actions/UtilsActions'
import DialogAddToCart from '../../components/Dialog/DialogAddToCart'
import {handleAddProductToCart} from '../../store/actions/CartActions'
import AppText from '../../components/SwitchLanguage/AppText'
import {successMessage} from '../../helpers/Utils'

const {width} = Dimensions.get('screen')

export default ProductsScreen = ({navigation, route}) => {
  const dispatch = useDispatch()
  const productsState = useSelector(state => state.products)

  const isFocused = useIsFocused()
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchContent, setSearchContent] = useState(null)
  const [isSearch, setIsSearch] = useState(false)
  const [categorySelected, setCategorySelected] = useState(null)
  const [sortActive, setSortActive] = useState('desc')
  const [itemAdd, setItemAdd] = useState(null)
  const [packingVariation, setPackingVariation] = useState([])

  const sortData = [
    {id: 'desc', name: I18n.t('sort-desc')},
    {id: 'asc', name: I18n.t('sort-asc')},
  ]

  useEffect(() => {
    if (route?.params?.search) {
      setSearchContent(route?.params?.search)
      setIsSearch(true)
      dispatch(handleLoading(true))
      dispatch(getListProduct(sortActive, null, route?.params?.search, true))
    }
    if (route?.params?.categoryId) {
      setCategorySelected(route?.params?.categoryId)
    }
  }, [route?.params])

  useEffect(() => {}, [])

  useEffect(() => {
    if (productsState.category.length > 0) {
      setCategorySelected(productsState.category[0].id)
    }
  }, [productsState.category])

  useEffect(() => {
    if (categorySelected) {
      isFocused && dispatch(handleLoading(true))
      dispatch(
        getListProduct(
          sortActive,
          categorySelected,
          searchContent,
          isFocused ? true : false,
          isFocused ? false : true,
        ),
      )
    }
  }, [categorySelected])

  _handleRefresh = () => {
    dispatch(handleLoading(true))
    dispatch(
      getListProduct(
        sortActive,
        isSearch ? null : categorySelected,
        searchContent,
        true,
      ),
    )
  }

  _handleSort = id => {
    setSortActive(id)
    dispatch(handleLoading(true))
    dispatch(
      getListProduct(
        id,
        isSearch ? null : categorySelected,
        searchContent,
        isFocused ? true : false,
        isFocused ? false : true,
      ),
    )
  }

  const _renderCategoryItem = useCallback(
    ({item, index}) => (
      <ProductCategory
        item={item}
        itemSelect={categorySelected}
        onClick={_handleClickCategoryItem}
      />
    ),
    [categorySelected],
  )

  _handleClickCategoryItem = item => {
    setCategorySelected(item.id)
  }

  const _renderProductItem = useCallback(
    ({item, index}) => (
      <ItemProduct
        data={item}
        itemStyle={[styles.containerProduct]}
        imageStyle={styles.imageView}
        isAdd={true}
        onClickItem={_handleClickProductItem}
        onClickAdd={_handleClickAddProductItem}
      />
    ),
    [productsState.listProducts],
  )

  _handleClickProductItem = data => {
    navigation.push('ProductDetail', {item: data})
  }

  _handleClickAddProductItem = (isAdd, data) => {
    setItemAdd(data)
    setPackingVariation([])
    if (!isAdd) {
      dispatch(getPackingVariation(data?.id, _getPackingVariationSuccess))
    }
  }

  _getPackingVariationSuccess = data => {
    setPackingVariation(data)
  }

  useEffect(() => {
    if (productsState.listProducts.length > 0) {
      setLoadingMore(false)
    }
  }, [productsState.listProducts])

  _handleLoadMore = () => {
    if (productsState.isMore) {
      setLoadingMore(true)
      dispatch(
        getMoreListProduct(
          sortActive,
          isSearch ? null : categorySelected,
          searchContent,
          productsState.pageIndex + 1,
        ),
      )
    }
  }

  const _renderFooter = useCallback(() => {
    if (!loadingMore)
      return productsState.listProducts.length > 0 ? (
        <View style={{height: 10}} />
      ) : (
        <AppText style={styles.textNull} title={'there-no-product'} />
      )
    return (
      <View style={styles.containerLoadMore}>
        <ActivityIndicator animating color={Colors.gray_4F4F4F} size='large' />
      </View>
    )
  }, [loadingMore, productsState.listProducts])

  _handleSearch = () => {
    isFocused && dispatch(handleLoading(true))
    setIsSearch(true)
    dispatch(getListProduct(sortActive, null, searchContent, true))
  }

  _handleCleanSearch = () => {
    setSearchContent(null)
    setIsSearch(false)
    isFocused && dispatch(handleLoading(true))
    dispatch(getListProduct(sortActive, categorySelected, null, true))
  }

  _handleActionAddDialog = params => {
    dispatch(handleAddProductToCart(params, _addCartSuccess))
  }

  _addCartSuccess = () => {
    dispatch(requestSuccess(successMessage.ADD_PRODUCT_SUCCESS))
    setItemAdd(null)
  }

  _openCart = () => {
    navigation.push('Cart')
  }

  return (
    <MenuProvider style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBar}>
        <Sort
          iconSort={require('../../assests/images/ic_filter_green.png')}
          onPress={_handleSort}
          dataSort={sortData}
          select={sortActive}
        />
        <SearchInput
          valueSearch={searchContent}
          containerStyle={{flex: 1, marginHorizontal: 8}}
          placeholderText={'search-product'}
          onTextChange={value => {
            if (value == '') {
              setSearchContent(null)
            } else setSearchContent(value)
          }}
          showClean={searchContent ? true : false}
          onSubmitSearch={_handleSearch}
          onCleanSearch={() => {
            _handleCleanSearch()
          }}
        />
        <TouchableOpacity
          onPress={_openCart}
          activeOpacity={0.5}
          style={styles.iconCart}>
          <Image
            resizeMode='contain'
            style={{width: 24, height: 24}}
            source={require('../../assests/images/ic_cart_green.png')}
          />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.iconCart}>
                    <Image
                        resizeMode='contain'
                        style={{ width: 32, height: 32 }}
                        source={require('../../assests/images/ic_filter_green.png')}
                    />
                </TouchableOpacity> */}
      </View>
      {isSearch && (
        <Text style={styles.textResult}>
          <AppText title={'search-info-for'} /> "{searchContent}"
        </Text>
      )}
      {!isSearch && (
        <View styles={{height: 40}}>
          <FlatList
            data={productsState.category}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginStart: 16}}
            keyExtractor={item => item.id.toString()}
            renderItem={_renderCategoryItem}
          />
        </View>
      )}
      <FlatList
        style={{marginHorizontal: 10, marginTop: 10}}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={productsState.listProducts}
        renderItem={_renderProductItem}
        extraData={(e, i) => i.toString()}
        keyExtractor={(e, i) => i.toString()}
        onEndReached={_handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={_renderFooter}
        onRefresh={_handleRefresh}
        refreshing={false}
      />
      <DialogAddToCart
        data={itemAdd}
        listPacking={packingVariation}
        modalVisible={itemAdd ? true : false}
        closeDialog={() => setItemAdd(null)}
        handleAction={_handleActionAddDialog}
      />
    </MenuProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  headerBar: {
    flexDirection: 'row',
    paddingTop: 14,
    marginBottom: 4,
    marginHorizontal: 16,
  },
  iconCart: {
    marginLeft: 10,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerProduct: {
    backgroundColor: Colors.white,
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
    maxWidth: width / 2 - 22,
    borderRadius: 6,
  },
  imageView: {
    height: width / 2 - 50,
    backgroundColor: Colors.gray_E0E0E0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  containerLoadMore: {
    marginBottom: 15,
  },
  textResult: {
    paddingTop: 8,
    paddingHorizontal: 16,
    color: Colors.gray_4F4F4F,
    fontSize: 16,
  },
  iconCart: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textNull: {
    color: Colors.gray_828282,
    marginTop: 50,
    textAlign: 'center',
  },
})
