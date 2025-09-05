import React, {useEffect, useState, useRef, useCallback, Component} from 'react'
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native'
import Colors from '../../styles/Colors'
import I18n from '../../config/LanguageConfig'
import FontSizes from '../../styles/FontSizes'
import SearchInput from '../../components/Input/SearchInput'
import CategoryMenuButton from '../../components/Category/CategoryMenuButton'
import ItemProduct from '../../components/Product/ItemProduct'
import ItemPost from '../../components/Post/ItemPost'
import {useDispatch, useSelector, connect} from 'react-redux'
import {getUserLogged, getAvatar} from '../../helpers/Storages'
import {
  handleAddProductToCart,
  handleGetProductsCart,
} from '../../store/actions/CartActions'
import {getListPosts} from '../../store/actions/PostsActions'
import Carousel, {Pagination} from 'react-native-snap-carousel'
import {
  getHomeBanner,
  handleLoading,
  requestSuccess,
} from '../../store/actions/UtilsActions'
import {
  getListProductsNewest,
  getCategory,
  getPackingVariation,
} from '../../store/actions/ProductsActions'
import {setAvatarUrl, setUserInfo} from '../../store/actions/UserAction'
import DialogAddToCart from '../../components/Dialog/DialogAddToCart'
import AppText from '../../components/SwitchLanguage/AppText'
import {successMessage} from '../../helpers/Utils'

const {width} = Dimensions.get('screen')

export default HomeScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const postsState = useSelector(state => state.posts)
  // const userState = useSelector(state => state.user)
  const productsState = useSelector(state => state.products)
  const utilsState = useSelector(state => state.utils)
  const language = useSelector(state => state.lang.language)

  const [searchContent, setSearchContent] = useState(null)
  const [activeSlider, setActiveSlider] = useState(0)
  const [itemAdd, setItemAdd] = useState(null)
  const [packingVariation, setPackingVariation] = useState([])
  const [i18n, setLocaleLanguage] = useState(I18n)

  const categoryColor = [
    '#00A74C',
    '#7CD419',
    '#D6C83B',
    '#F78640',
    '#06C30D',
    '#00C797',
    '#67A107',
    '#EA4C4F',
  ]

  const checkUser = async () => {
    let userWoo = await getUserLogged()
    let avatar = await getAvatar()
    dispatch(setAvatarUrl(avatar))
    dispatch(setUserInfo(userWoo))
  }

  useEffect(() => {
    dispatch(handleLoading(false))
    dispatch(getCategory(i18n.locale))
    dispatch(getHomeBanner())
    dispatch(handleGetProductsCart())
    dispatch(getListPosts(false, i18n.locale))
    checkUser()
  }, [i18n.locale])

  useEffect(() => {
    dispatch(getListPosts(false, i18n.locale))
  }, [i18n.locale])

  useEffect(() => {
    i18n.locale = language
    setLocaleLanguage(i18n)
  }, [i18n.locale])

  useEffect(() => {
    if (
      utilsState.isDoneBanner &&
      productsState.isDoneTodayOffers &&
      productsState.isDoneProductsNewest
    ) {
      dispatch(handleLoading(true))
    }
  }, [
    utilsState.isDoneBanner,
    productsState.isDoneTodayOffers,
    productsState.isDoneProductsNewest,
  ])

  useEffect(() => {
    if (productsState.category.length >= 2) {
      dispatch(
        getListProductsNewest(productsState.category[1]?.id, i18n.locale),
      )
    }
  }, [productsState.category, i18n.locale])

  _handleShowProductDetail = data => {
    navigation.push('ProductDetail', {item: data})
  }

  _handleClickAddProductItemInHome = (isAdd, data) => {
    setItemAdd(data)
    setPackingVariation([])
    if (!isAdd) {
      dispatch(getPackingVariation(data?.id, _getPackingVariationInHomeSuccess))
    }
  }

  _getPackingVariationInHomeSuccess = data => {
    setPackingVariation(data)
  }

  _handleShowProductListByCategory = id => {
    navigation.navigate('Products', {categoryId: id, search: null})
  }

  _handleShowProductsListTodayOffers = () => {
    navigation.navigate('Products', {
      categoryId: productsState.category[0]?.id,
      search: null,
    })
  }

  _handleShowProductsListNewest = () => {
    navigation.navigate('Products', {
      categoryId: productsState.category[1]?.id,
      search: null,
    })
  }

  const _renderCategoryMenuItem = ({item, index}) => (
    <CategoryMenuButton
      color={categoryColor[index % 8]}
      onClick={_handleShowProductListByCategory}
      value={item}
      key={item.id}
      customStyle={{marginRight: 8}}
    />
  )

  const _renderProductItemOfferToday = ({item, index}) => (
    <ItemProduct
      data={item}
      itemStyle={[styles.containerProduct]}
      imageStyle={styles.imageView}
      isAdd={true}
      onClickItem={_handleShowProductDetail}
      onClickAdd={_handleClickAddProductItemInHome}
    />
  )

  const _renderProductItemNewest = ({item, index}) => (
    <ItemProduct
      data={item}
      itemStyle={[styles.containerProduct]}
      imageStyle={styles.imageView}
      isAdd={true}
      onClickItem={_handleShowProductDetail}
      onClickAdd={_handleClickAddProductItemInHome}
    />
  )

  _handleActionAddDialogInHome = params => {
    dispatch(handleAddProductToCart(params, _addCartInHomeSuccess))
  }

  _addCartInHomeSuccess = () => {
    dispatch(requestSuccess(successMessage.ADD_PRODUCT_SUCCESS))
    setItemAdd(null)
  }

  const _renderPost = ({item, index}) => (
    <ItemPost
      index={index}
      value={item}
      onClickItem={_onClickPostItem}
      itemStyle={styles.containerPost}
      imageStyle={styles.imageView}
    />
  )

  _openCart = () => {
    navigation.push('Cart')
  }

  _onClickViewMorePosts = () => {
    navigation.push('Post')
  }

  _onClickPostItem = (value, index) => {
    navigation.push('PostDetail', {item: value, index: index})
  }

  _handleSearchProductFromHome = () => {
    if (searchContent == null) {
      navigation.navigate('Products')
    } else {
      navigation.navigate('Products', {categoryId: null, search: searchContent})
      setSearchContent(null)
    }
  }

  const pagination = () => {
    return (
      <Pagination
        dotsLength={utilsState.homeBanner.length}
        activeDotIndex={activeSlider}
        containerStyle={{
          position: 'absolute',
          bottom: -10,
          alignSelf: 'center',
        }}
        dotContainerStyle={{
          margin: 0,
          padding: 0,
        }}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
          borderRadius: 1,
          backgroundColor: Colors.green_00A74C,
        }}
      />
    )
  }

  _renderBanner = ({item, index}) => {
    return (
      <Image
        style={{flex: 1, backgroundColor: Colors.gray_E0E0E0}}
        resizeMode='cover'
        source={{uri: item?.guid?.rendered}} //item?.media_details?.sizes?.medium_large?.source_url
      />
    )
  }

  return (
    <View>
      <View style={styles.headerBar}>
        <SearchInput
          valueSearch={searchContent}
          containerStyle={{flex: 1}}
          placeholderText={'search-product'}
          onTextChange={value => {
            if (value == '') {
              setSearchContent(null)
            } else setSearchContent(value)
          }}
          showClean={searchContent ? true : false}
          onSubmitSearch={_handleSearchProductFromHome}
          onCleanSearch={() => setSearchContent(null)}
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
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <FlatList
          style={{flex: 1, marginBottom: 14, paddingStart: 16}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={productsState.category}
          renderItem={_renderCategoryMenuItem}
          keyExtractor={(e, i) => i.toString()}
          ListFooterComponent={<View style={{width: 16}} />}
        />
        <View style={{height: width / 2, width: '100%'}}>
          {/* ========================================= */}
          {/* <Image
                        resizeMode='cover'
                        style={{ height: width / 3, width: "100%", borderRadius: 4 }}
                        source={require('../../assests/images/bg_banner.png')}
                    /> */}
          {/* ========================================= */}
          <Carousel
            // ref={(c) => { this._carousel = c; }}
            data={utilsState.homeBanner}
            renderItem={_renderBanner}
            onSnapToItem={index => {
              setActiveSlider(index)
            }}
            sliderWidth={width}
            itemWidth={width}
            autoplay={true}
            loop
            autoplayInterval={5000}
            removeClippedSubviews={false}
          />
          {pagination()}
        </View>

        <View style={styles.lineTitle}>
          <Text style={styles.textTitleOfList}>
            {productsState.category[0]?.name || i18n.t('today-deal')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={_handleShowProductsListTodayOffers}>
            <Text style={styles.textViewMore}>{i18n.t('read-more')}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{flex: 1, marginStart: 16}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={productsState.listProductsTodayOffers}
          renderItem={_renderProductItemOfferToday}
          keyExtractor={(e, i) => i.toString()}
          extraData={(e, i) => i.toString()}
        />
        <View style={styles.lineTitle}>
          <Text style={styles.textTitleOfList}>
            {productsState.category[1]?.name || i18n.t('new-product')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={_handleShowProductsListNewest}>
            <Text style={styles.textViewMore}>{i18n.t('read-more')}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{flex: 1, marginStart: 16}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={productsState.listProductsNewest}
          renderItem={_renderProductItemNewest}
          keyExtractor={(e, i) => i.toString()}
          extraData={(e, i) => i.toString()}
        />
        <View style={styles.lineTitle}>
          <Text style={styles.textTitleOfList}>{i18n.t('deli-recipe')}</Text>
          <TouchableOpacity onPress={_onClickViewMorePosts} activeOpacity={0.5}>
            <Text style={styles.textViewMore}>{i18n.t('read-more')}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{flex: 1, marginStart: 16}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={postsState.listPostsHome}
          renderItem={_renderPost}
          keyExtractor={(e, i) => i.toString()}
          extraData={(e, i) => i.toString()}
        />
        <View style={{height: 90}} />
      </ScrollView>
      <DialogAddToCart
        data={itemAdd}
        listPacking={packingVariation}
        modalVisible={itemAdd ? true : false}
        closeDialog={() => setItemAdd(null)}
        handleAction={_handleActionAddDialogInHome}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  headerBar: {
    flexDirection: 'row',
    marginVertical: 12,
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
    height: 192,
    width: 135,
    borderRadius: 6,
    backgroundColor: Colors.white,
    marginRight: 12,
  },
  imageView: {
    height: 115,
    backgroundColor: Colors.gray_E0E0E0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  containerPost: {
    height: 170,
    width: 135,
    borderRadius: 6,
    backgroundColor: Colors.white,
    marginRight: 12,
  },
  textTitleOfList: {
    color: Colors.black_22281F,
    fontSize: FontSizes.size16,
    fontWeight: '700',
  },
  textViewMore: {
    paddingTop: 2,
    paddingLeft: 10,
    color: Colors.green_00A74C,
    fontSize: FontSizes.size14,
  },
  lineTitle: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 12,
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
})
