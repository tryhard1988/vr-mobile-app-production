import React, {useEffect, useState, useRef, useCallback} from 'react';
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
  Alert,
} from 'react-native';
import Colors from '../../styles/Colors';
import FontSizes from '../../styles/FontSizes';
import LinearGradient from 'react-native-linear-gradient';
import HTML from 'react-native-render-html';
import ItemPack from '../../components/Product/ItemPack';
import ItemProduct from '../../components/Product/ItemProduct';
import ItemFeedback from '../../components/Product/ItemFeedback';
import Stars from 'react-native-stars';
import InputView from '../../components/Other/InputView';
import DialogAddToCart from '../../components/Dialog/DialogAddToCart';
import {
  getPackingVariation,
  getProductReview,
  sendProductReview,
  getDetailProduct,
  getPostsOfProduct,
} from '../../store/actions/ProductsActions';
import {useSelector, useDispatch} from 'react-redux';
import {requestSuccess} from '../../store/actions/UtilsActions';
import {handleAddProductToCart} from '../../store/actions/CartActions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ItemPost from '../../components/Post/ItemPost';
import AppText from '../../components/SwitchLanguage/AppText';
import I18n from '../../config/LanguageConfig';
import {successMessage} from '../../helpers/Utils';

const {width} = Dimensions.get('screen');

export default ProductDetailScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const productsState = useSelector((state) => state.products);

  const [data, setData] = useState(route.params?.item);
  const [postsOfProduct, setPostsOfProduct] = useState([]);
  const [packingVariation, setPackingVariation] = useState([]);
  const [packSelected, setPackSelected] = useState(null);
  const [ratingStar, setRatingStar] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isAddToCart, setIsAddToCart] = useState(false);
  const [isBuyNow, setIsBuyNow] = useState(false);

  useEffect(() => {
    productsState.productReview = [];
    if (route.params?.item) {
      if (route.params?.isGetData) {
        dispatch(getDetailProduct(route.params?.item, getDetailSuccess));
        dispatch(
          getPostsOfProduct(route.params?.item, _getPostsOfProductSuccess),
        );
        dispatch(
          getPackingVariation(route.params?.item, _getPackingVariationSuccess),
        );
        dispatch(getProductReview(route.params?.item));
      } else {
        setData(route.params?.item);
        dispatch(
          getPostsOfProduct(route.params?.item?.id, _getPostsOfProductSuccess),
        );
        route.params?.item?.variations?.length > 0 &&
          dispatch(
            getPackingVariation(
              route.params?.item?.id,
              _getPackingVariationSuccess,
            ),
          );
        route.params?.item?.reviews_allowed &&
          dispatch(getProductReview(route.params?.item?.id));
      }
    }
  }, [
    // data,
    // postsOfProduct,
    // packingVariation,
    // packSelected,
    // ratingStar,
    // feedback,
    // isAddToCart,
    // isBuyNow,
  ]);

  _getPostsOfProductSuccess = (data) => {
    setPostsOfProduct(data);
  };

  _getPackingVariationSuccess = (data) => {
    setPackingVariation(data);
  };

  getDetailSuccess = (res) => {
    setData(res);
  };

  useEffect(() => {
    if (packingVariation?.length > 0) {
      setPackSelected(packingVariation[0]);
    }
  }, [packingVariation]);

  const _renderProductPackItem = useCallback(
    ({item, index}) => (
      <ItemPack
        value={item}
        selected={packSelected}
        onClick={_handleClickPackItem}
      />
    ),
    [packSelected],
  );

  _handleClickPackItem = (item) => {
    setPackSelected(item);
  };

  const _renderPostItemSame = useCallback(
    ({item, index}) => (
      <ItemPost
        index={index}
        value={item}
        isTag={true}
        itemStyle={[styles.containerProduct]}
        imageStyle={styles.imageView}
        onClickItem={_handleClickPostItemSame}
      />
    ),
    [],
  );

  _handleClickPostItemSame = (value, index) => {
    navigation.push('PostDetail', {
      item: value,
      index: index,
      fetchDetail: true,
    });
  };

  _handleMoreRelatedPosts = () => {
    navigation.push('Post');
  };

  const _renderFeedbackItem = useCallback(
    ({item, index}) => <ItemFeedback data={item} />,
    [],
  );

  _handleOpenCart = () => {
    navigation.push('Cart');
  };

  _handleBackProducts = () => {
    navigation.pop();
  };

  _handleDialogAddToCart = () => {
    setIsBuyNow(false);
    setIsAddToCart(!isAddToCart);
  };

  _handleDialogBuyNow = () => {
    setIsBuyNow(!isBuyNow);
    setIsAddToCart(!isAddToCart);
  };

  const _renderNoFeedback = useCallback(() => {
    return productsState.productReview.length == 0 ? (
      <AppText style={styles.textNoFeedback} title={'no-review-yet'} />
    ) : null;
  }, [productsState.productReview]);

  _handleActionDialog = (params, buyNow) => {
    if (buyNow) {
      _handleDialogAddToCart();
      let dataOrder = [];
      dataOrder.push(params);
      navigation.push('OrderInformation', {
        data: {
          orderProducts: dataOrder,
        },
      });
    } else {
      dispatch(handleAddProductToCart(params, _addCartSuccess));
    }
  };

  _addCartSuccess = () => {
    dispatch(requestSuccess(successMessage.ADD_PRODUCT_SUCCESS));
    _handleDialogAddToCart();
  };

  _sendProductReview = () => {
    if (ratingStar) {
      let params = {
        review: feedback,
        rating: parseInt(ratingStar),
        name: userState.userInfo?.username,
        email: userState.userInfo?.email,
      };
      dispatch(sendProductReview(data?.id, params, _reviewSuccess));
    } else {
      Alert.alert(null, I18n.t('rate-product'), [
        {text: I18n.t('0k'), onPress: () => {}, style: 'default'},
      ]);
    }
  };

  _reviewSuccess = () => {
    setRatingStar(null);
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          style={{height: width * 0.8, width: '100%'}}
          resizeMode="cover"
          source={{uri: data?.images?.length > 0 ? data.images[0].src : null}}>
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
              onPress={_handleBackProducts}>
              <Image
                source={require('../../assests/images/ic_arrow_left_white.png')}
                resizeMode="contain"
                style={{height: 28, width: 28}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={_handleOpenCart}>
              <Image
                source={require('../../assests/images/ic_cart_white.png')}
                resizeMode="contain"
                style={{height: 28, width: 28}}
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
          <Text style={styles.textName}>{data?.name}</Text>
          <FlatList
            style={{marginTop: 8}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={packingVariation}
            renderItem={_renderProductPackItem}
            keyExtractor={(e, i) => i.toString()}
          />
        </View>
        <View
          style={{
            backgroundColor: Colors.white,
            paddingHorizontal: 16,
            paddingTop: 12,
            marginTop: 8,
            paddingBottom: 8,
          }}>
          <AppText
            style={[styles.textTitle, {marginBottom: 10}]}
            title={'product-info'}
          />
          <HTML
            source={{html: data?.description || 'Không có dữ liệu'}}
            baseFontStyle={styles.textContent}
            contentWidth={width}
            enableExperimentalPercentWidth={true}
            ignoredStyles={['font-family', 'height', 'width']}
          />
        </View>
        {data?.reviews_allowed && (
          <View
            style={{
              backgroundColor: Colors.white,
              paddingVertical: 12,
              marginTop: 8,
            }}>
            <AppText
              style={[styles.textTitle, {paddingHorizontal: 16}]}
              title={'rate'}
            />
            {userState.userInfo ? (
              <View
                style={{
                  backgroundColor: Colors.gray_F2,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  marginTop: 12,
                }}>
                {/* <Stars
                  rating={ratingStar}
                  spacing={2}
                  update={(value) => setRatingStar(value)}
                  count={5}
                  starSize={30}
                  fullStar={require('../../assests/images/ic_full_star.png')}
                  emptyStar={require('../../assests/images/ic_empty_star.png')}
                /> */}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    alignItems: 'center',
                  }}>
                  <InputView
                    title="write-review"
                    onChangeText={(text) => setFeedback(text)}
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
                    onPress={_sendProductReview}
                    activeOpacity={0.5}
                    style={styles.buttonSend}>
                    <AppText style={{color: Colors.white}} title={'send'} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  marginHorizontal: 16,
                  marginBottom: 8,
                  flexDirection: 'row',
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
                <AppText title={'to-send-review'} />
              </View>
            )}
            <FlatList
              style={{paddingHorizontal: 8}}
              data={productsState?.productReview}
              renderItem={_renderFeedbackItem}
              keyExtractor={(e, i) => i.toString()}
              extraData={(e, i) => i.toString()}
              ListFooterComponent={_renderNoFeedback}
            />
          </View>
        )}
        {postsOfProduct.length > 0 && (
          <View
            style={{
              backgroundColor: Colors.white,
              paddingStart: 16,
              paddingVertical: 12,
              marginTop: 8,
            }}>
            <View style={styles.lineTitle}>
              <AppText style={styles.textTitleOfList} title={'relate-post'} />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={_handleMoreRelatedPosts}>
                <AppText style={styles.textViewMore} title={'read-more'} />
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={postsOfProduct}
              renderItem={_renderPostItemSame}
              keyExtractor={(e, i) => i.toString()}
              extraData={(e, i) => i.toString()}
            />
          </View>
        )}
        <View style={{height: 8}} />
      </KeyboardAwareScrollView>
      <View style={styles.viewFooter}>
        <TouchableOpacity
          onPress={_handleDialogAddToCart}
          activeOpacity={0.5}
          style={[styles.containerFooterButton]}>
          <AppText
            style={{color: Colors.green_00A74C, fontSize: FontSizes.size14}}
            title={'add-to-cart'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_handleDialogBuyNow}
          activeOpacity={0.5}
          style={[
            styles.containerFooterButton,
            {backgroundColor: Colors.green_00A74C},
          ]}>
          <AppText
            style={{color: Colors.white, fontSize: FontSizes.size14}}
            title={'buy-now'}
          />
        </TouchableOpacity>
      </View>
      <DialogAddToCart
        data={data}
        listPacking={packingVariation}
        packing={packSelected}
        isBuy={isBuyNow}
        modalVisible={isAddToCart}
        closeDialog={_handleDialogAddToCart}
        handleAction={_handleActionDialog}
      />
    </View>
  );
};

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
    marginBottom: 4,
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
    height: 180,
    width: 135,
    borderRadius: 6,
    backgroundColor: Colors.white,
    marginRight: 12,
    borderWidth: 0.5,
    borderColor: Colors.gray_BDBDBD,
  },
  imageView: {
    height: 115,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  textNoFeedback: {
    flex: 1,
    textAlign: 'center',
    color: Colors.gray_4F4F4F,
    fontSize: FontSizes.size14,
    marginTop: 10,
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
});
