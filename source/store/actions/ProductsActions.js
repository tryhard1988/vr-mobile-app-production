import {apiJson, qrScanJson} from '../../config/ApiConfig';
import WooCommerce from '../../config/ApiWooCommerce';
import {errorList} from '../../helpers/Utils';
import Actions from './Actions';
import {handleLoading, rawError, requestError} from './UtilsActions';

// category
const getCategoryRequest = () => {
  return {
    type: Actions.GET_CATEGORY_REQUEST,
  };
};

const getCategorySuccess = (data) => {
  return {
    type: Actions.GET_CATEGORY_SUCCESS,
    data,
  };
};

const getCategoryFailure = () => {
  return {
    type: Actions.GET_CATEGORY_FAILURE,
  };
};

export const getCategory = (lang) => {
  let params = {orderby: 'description'};
  lang
    ? lang === 'en'
      ? (params['lang'] = 'en-gb')
      : (params['lang'] = 'vi')
    : (params['lang'] = 'vi');
  return (dispatch) => {
    dispatch(handleLoading(true));
    dispatch(getCategoryRequest());
    WooCommerce.get('products/categories', params)
      .then((res) => {
        dispatch(getCategorySuccess(res));
      })
      .catch((err) => {
        dispatch(getCategoryFailure());
        dispatch(rawError(err?.message));
      });
  };
};

// get variations in detail: packing
export const getPackingVariation = (productId, onSuccess) => {
  return (dispatch) => {
    dispatch(handleLoading(true));
    WooCommerce.get(`products/${productId}/variations`)
      .then((res) => {
        let packing = [];
        if (res.length > 0) {
          res.forEach((element) => {
            element?.attributes.length > 0 &&
              packing.push({
                id: element.id,
                name: element.attributes[0]?.option,
              });
          });
        }
        onSuccess && onSuccess(packing);
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(rawError(err?.message));
        dispatch(handleLoading(false));
      });
  };
};

// home today offers
const getListProductsTodayOffersSuccess = (data) => {
  return {
    type: Actions.GET_LIST_PRODUCTS_TODAY_OFFERS_SUCCESS,
    data,
  };
};

// export const getListProductsTodayOffers = category => {
//   let params = {per_page: 10, page: 1}
//   category ? (params['category'] = category) : null

//   return dispatch => {
//     WooCommerce.get('products', params)
//       .then(res => {
//         dispatch(getListProductsTodayOffersSuccess(res))
//       })
//       .catch(err => {
//         dispatch(requestError('Không lấy được danh sách ưu đãi hôm nay'))
//       })
//   }
// }

// home products newest
const getListProductsNewestSuccess = (data) => {
  return {
    type: Actions.GET_LIST_PRODUCTS_NEWEST_SUCCESS,
    data,
  };
};

export const getListProductsNewest = (category, lang) => {
  let params = {per_page: 10, page: 1};
  category ? (params['category'] = category) : null;
  lang
    ? lang === 'en'
      ? (params['lang'] = 'en-gb')
      : (params['lang'] = 'vi')
    : (params['lang'] = 'vi');
  return (dispatch) => {
    WooCommerce.get('products', params)
      .then((res) => {
        dispatch(getListProductsNewestSuccess(res));
      })
      .catch((err) => {
        dispatch(requestError(errorList.NO_NEW_PRODUCT));
      });
  };
};

// products list
const getListProductsRequest = () => {
  return {
    type: Actions.GET_LIST_PRODUCTS_REQUEST,
  };
};

const getListProductsSuccess = (data) => {
  return {
    type: Actions.GET_LIST_PRODUCTS_SUCCESS,
    data,
  };
};

const getListProductsFailure = () => {
  return {
    type: Actions.GET_LIST_PRODUCTS_FAILURE,
  };
};

export const getListProduct = (
  sort,
  category,
  searchText,
  isLoading = false,
  isHomeData = false,
) => {
  let params = {
    per_page: 10,
    page: 1,
    order: sort,
    status: 'publish',
  };
  category ? (params['category'] = category) : null;
  searchText ? (params['search'] = `"${searchText}"`) : null;

  return (dispatch) => {
    dispatch(getListProductsRequest());
    WooCommerce.get('products', params)
      .then((res) => {
        dispatch(getListProductsSuccess(res));
        isHomeData && dispatch(getListProductsTodayOffersSuccess(res));
        isLoading && dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(getListProductsFailure(err));
        isLoading && dispatch(handleLoading(false));
        dispatch(rawError(err.message));
      });
  };
};

// products list more
const getMoreListProductsRequest = () => {
  return {
    type: Actions.GET_MORE_LIST_PRODUCTS_REQUEST,
  };
};

const getMoreListProductsSuccess = (data) => {
  return {
    type: Actions.GET_MORE_LIST_PRODUCTS_SUCCESS,
    data,
  };
};

const getMoreListProductsFailure = () => {
  return {
    type: Actions.GET_MORE_LIST_PRODUCTS_FAILURE,
  };
};

export const getMoreListProduct = (
  sort,
  category,
  searchText,
  pageIndex,
  lang,
) => {
  return (dispatch) => {
    dispatch(getMoreListProductsRequest());
    let params = {per_page: 10, order: sort, status: 'publish'};
    pageIndex ? (params['page'] = pageIndex) : null;
    category ? (params['category'] = category) : null;
    searchText ? (params['search'] = `"${searchText}"`) : null;
    lang
      ? lang === 'en'
        ? (params['lang'] = 'en-gb')
        : (params['lang'] = 'vi')
      : (params['lang'] = 'vi');
    WooCommerce.get(`products`, params)
      .then((res) => {
        dispatch(getMoreListProductsSuccess(res));
      })
      .catch((err) => {
        dispatch(getMoreListProductsFailure(err));
      });
  };
};

// detail product
export const getDetailProduct = (productId, onSuccess) => {
  return (dispatch) => {
    dispatch(handleLoading(true));
    WooCommerce.get(`products/${productId}`)
      .then((res) => {
        onSuccess ? onSuccess(res) : null;
        setTimeout(() => dispatch(handleLoading(false)), 2000);
      })
      .catch((err) => {
        dispatch(rawError(err.message));
        dispatch(handleLoading(false));
      });
  };
};

// get product review
const getProductReviewRequest = () => {
  return {
    type: Actions.GET_PRODUCT_REVIEW_REQUEST,
  };
};

const getProductReviewSuccess = (data) => {
  return {
    type: Actions.GET_PRODUCT_REVIEW_SUCCESS,
    data,
  };
};

const getProductReviewFailure = () => {
  return {
    type: Actions.GET_PRODUCT_REVIEW_FAILURE,
  };
};

export const getProductReview = (productId) => {
  return (dispatch) => {
    dispatch(handleLoading(true));
    dispatch(getProductReviewRequest());
    WooCommerce.get(`products/${productId}/reviews`)
      .then((res) => {
        dispatch(getProductReviewSuccess(res));
        setTimeout(() => dispatch(handleLoading(false)), 2000);
      })
      .catch((err) => {
        dispatch(getProductReviewFailure());
        dispatch(rawError(err?.message));
        dispatch(handleLoading(false));
      });
  };
};

// qr scan
const getQrScanInfoSuccess = (data) => {
  return {
    type: Actions.GET_QR_SCAN_INFO_SUCCESS,
    data,
  };
};

export const getQrScanInfo = (code, onScanSuccess) => {
  return (dispatch) => {
    dispatch(handleLoading(true));
    qrScanJson
      .get(`erp/lot/${code}`)
      .then((res) => {
        if (res?.data?.data?.length > 0) {
          onScanSuccess && onScanSuccess(res?.data?.data[0]);
        } else {
          dispatch(requestError(errorList.GET_INFO_PRODUCT_FAIL));
        }
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(rawError(err));
        dispatch(handleLoading(false));
      });
  };
};

// send product review
const sendReviewSuccess = (data) => {
  return {
    type: Actions.SEND_PRODUCT_REVIEW_SUCCESS,
    data,
  };
};

export const sendProductReview = (productId, params, onSuccess) => {
  return (dispatch) => {
    dispatch(handleLoading(true));
    dispatch(getCategoryRequest());
    WooCommerce.post(`products/${productId}/reviews`, params)
      .then((res) => {
        dispatch(sendReviewSuccess(res));
        onSuccess ? onSuccess() : null;
        dispatch(handleLoading(false));
      })
      .catch((err) => {
        dispatch(rawError(err?.message));
        dispatch(handleLoading(false));
      });
  };
};

export const getPostsOfProduct = (productId, onSuccess) => {
  return (dispatch) => {
    dispatch(handleLoading(true));
    apiJson
      .get(`wl/v1/get_post_list_by_tag_name/?product_id=${productId}`)
      .then((res) => {
        onSuccess ? onSuccess(res.data) : null;
      })
      .catch((err) => {
        const message = err.response?.data?.message || err.message;
        dispatch(rawError(message));
        dispatch(handleLoading(false));
      });
  };
};
