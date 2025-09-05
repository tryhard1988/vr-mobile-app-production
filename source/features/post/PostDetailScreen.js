import React, {useEffect, useState, useRef, useCallback} from 'react'
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  FlatList,
} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import HTML from 'react-native-render-html'
import InputView from '../../components/Other/InputView'
import ItemPost from '../../components/Post/ItemPost'
import {useSelector, useDispatch} from 'react-redux'
import ItemComment from '../../components/Product/ItemComment'
import {
  commentPost,
  getListPosts,
  getPostDetail,
  getProductsOfPost,
} from '../../store/actions/PostsActions'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import ItemProduct from '../../components/Product/ItemProduct'
import DialogAddToCart from '../../components/Dialog/DialogAddToCart'
import {handleAddProductToCart} from '../../store/actions/CartActions'
import {requestSuccess} from '../../store/actions/UtilsActions'
import {getPackingVariation} from '../../store/actions/ProductsActions'
import I18n from '../../config/LanguageConfig'
import AppText from '../../components/SwitchLanguage/AppText'
import {successMessage} from '../../helpers/Utils'

const {width} = Dimensions.get('screen')

export default PostDetailScreen = ({navigation, route}) => {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)
  const postsState = useSelector(state => state.posts)
  const [data, setData] = useState(route?.params?.item)
  const [listComment, setListComment] = useState([])
  const [productsOfPost, setProductsOfPost] = useState([])
  const [feedback, setFeedback] = useState('')
  const [itemAdd, setItemAdd] = useState(null)
  const [packingVariation, setPackingVariation] = useState([])

  useEffect(() => {
    if (route?.params?.fetchDetail != undefined && route?.params?.fetchDetail) {
      dispatch(getPostDetail(route.params?.item?.id, _getPostDetailSuccess))
    }
    dispatch(
      getProductsOfPost(route.params?.item?.id, _getProductsOfPostSuccess),
    )
    if (route?.params?.index != undefined) {
      data?._embedded?.replies?.length > 0 &&
        setListComment(data?._embedded?.replies[0])
    }
  }, [])

  _getProductsOfPostSuccess = data => {
    setProductsOfPost(data)
  }

  _getPostDetailSuccess = detail => {
    setData(detail)
  }

  const _renderProductItemSame = useCallback(
    ({item, index}) => (
      <ItemProduct
        data={item}
        byTag={true}
        itemStyle={[styles.containerProduct]}
        imageStyle={styles.imageView}
        onClickItem={_handleClickProductItemSame}
        onClickAdd={_handleClickAddProductItemSame}
      />
    ),
    [productsOfPost],
  )

  _handleClickProductItemSame = data => {
    navigation.push('ProductDetail', {item: data?.id, isGetData: true})
  }

  _handleClickAddProductItemSame = (isAdd, data) => {
    setItemAdd(data)
    setPackingVariation([])
    if (!isAdd) {
      dispatch(getPackingVariation(data?.id, _getPackingVariationInPostSuccess))
    }
  }

  _getPackingVariationInPostSuccess = data => {
    setPackingVariation(data)
  }

  const _renderCommentItem = useCallback(
    ({item, index}) => <ItemComment data={item} />,
    [],
  )

  _handleBackList = () => {
    navigation.pop()
  }

  _handleViewMoreProducts = () => {
    navigation.navigate('Products')
  }

  _sendComment = () => {
    if (feedback.trim() !== '' && feedback) {
      dispatch(
        commentPost(
          userState.userInfo.email,
          userState.userInfo.username,
          feedback,
          data.id,
          _sendCommentSuccess,
        ),
      )
    }
  }

  _sendCommentSuccess = comment => {
    setListComment([comment, ...listComment])
    setFeedback('')
    dispatch(getListPosts(true, i18n.locale))
  }

  _onClickLogin = () => {
    navigation.push('Auth')
  }

  _handleActionAddDialogInPost = params => {
    dispatch(handleAddProductToCart(params, _addCartInPostSuccess))
  }

  _addCartInPostSuccess = () => {
    dispatch(requestSuccess(successMessage.ADD_PRODUCT_SUCCESS))
    setItemAdd(null)
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          style={{height: width * 0.8, width: '100%'}}
          resizeMode='cover'
          source={
            (data?._embedded || {})['wp:featuredmedia']?.length > 0 && {
              uri: data?._embedded['wp:featuredmedia'][0]?.source_url || null,
            }
          }>
          {/* <LinearGradient colors={[Colors.black, Colors.gray_BDBDBD, Colors.white, Colors.gray_F2]} style={styles.imageOverlay}>
                    </LinearGradient> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={_handleBackList}>
              <Image
                source={require('../../assests/images/ic_arrow_left_white.png')}
                resizeMode='contain'
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View
          style={{
            backgroundColor: Colors.white,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}>
          <HTML
            source={{html: data?.title?.rendered}}
            baseFontStyle={styles.textName}
            contentWidth={width}
          />
          <HTML
            source={{html: data?.content?.rendered}}
            baseFontStyle={styles.textContent}
            contentWidth={width}
            enableExperimentalPercentWidth={true}
          />
        </View>
        {productsOfPost.length > 0 && (
          <View
            style={{
              backgroundColor: Colors.white,
              paddingStart: 16,
              paddingVertical: 12,
              marginTop: 8,
            }}>
            <View style={styles.lineTitle}>
              <AppText
                style={styles.textTitleOfList}
                title={'relate-product'}
              />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={_handleViewMoreProducts}>
                <AppText style={styles.textViewMore} title={'read-more'} />
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={productsOfPost}
              renderItem={_renderProductItemSame}
              keyExtractor={(e, i) => i.toString()}
              extraData={(e, i) => i.toString()}
            />
          </View>
        )}
        <View
          style={{
            backgroundColor: Colors.white,
            paddingVertical: 12,
            marginTop: 8,
          }}>
          <AppText
            style={[styles.textTitle, {paddingHorizontal: 16}]}
            title={'comment'}
          />
          {userState.userInfo ? (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                alignItems: 'center',
              }}>
              <InputView
                title='w-cmt'
                onChangeText={text => setFeedback(text)}
                value={feedback}
                containerStyle={{flex: 1}}
                inputStyle={{
                  backgroundColor: Colors.white,
                  height: 50,
                  textAlignVertical: 'top',
                  paddingVertical: 5,
                }}
                isMultiline={true}
              />
              <TouchableOpacity
                onPress={_sendComment}
                activeOpacity={0.5}
                style={styles.buttonSend}>
                <AppText style={{color: Colors.white}} title={'send'} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 16,
                marginBottom: 5,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={_onClickLogin}
                style={{paddingVertical: 10}}>
                <AppText
                  style={{color: Colors.green_00A74C}}
                  title={'sign-in'}
                />
              </TouchableOpacity>
              <AppText title={'to-send-cmt'} />
            </View>
          )}
          <FlatList
            style={{paddingHorizontal: 8}}
            data={listComment}
            renderItem={_renderCommentItem}
            keyExtractor={(e, i) => i.toString()}
            extraData={(e, i) => i.toString()}
          />
        </View>
        <View style={{height: 8}} />
      </KeyboardAwareScrollView>
      <DialogAddToCart
        isTag={true}
        listPacking={packingVariation}
        data={itemAdd}
        modalVisible={itemAdd ? true : false}
        closeDialog={() => setItemAdd(null)}
        handleAction={_handleActionAddDialogInPost}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  containerScroll: {
    flex: 1,
  },
  headerButton: {
    margin: 12,
    height: 40,
    width: 40,
    backgroundColor: Colors.gray_BDBDBD,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFooter: {
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    // right: 0,
    height: 60,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  containerFooterButton: {
    flex: 0.5,
    height: 40,
    borderColor: Colors.green_00A74C,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  textName: {
    fontSize: FontSizes.size18,
    fontWeight: '700',
    color: Colors.black_22281F,
  },
  textApplyPrice: {
    textAlign: 'right',
    fontSize: FontSizes.size20,
    color: Colors.orange_F68B1F,
  },
  textOriginalPrice: {
    fontSize: FontSizes.size14,
    color: Colors.gray_BDBDBD,
    textDecorationLine: 'line-through',
  },
  textTitle: {
    fontSize: FontSizes.size16,
    fontWeight: '700',
    color: Colors.black_22281F,
  },
  textContent: {
    fontSize: FontSizes.size14,
    color: Colors.black_22281F,
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
    paddingBottom: 12,
    paddingEnd: 16,
    justifyContent: 'space-between',
  },
  containerProduct: {
    height: 192,
    width: 135,
    borderRadius: 6,
    backgroundColor: Colors.white,
    marginRight: 12,
    borderWidth: 0.5,
    borderColor: Colors.gray_BDBDBD,
  },
  imageView: {
    backgroundColor: Colors.gray_E0E0E0,
    height: 115,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  textViewMoreFeedback: {
    color: Colors.green_00A74C,
    fontSize: FontSizes.size14,
    padding: 10,
  },
  buttonSend: {
    // marginTop: 8,
    height: 36,
    width: 55,
    borderRadius: 6,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.green_00A74C,
  },
})
